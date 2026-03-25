import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type, question, answer, role } = await req.json();

    // 🔥 GENERATE QUESTION
    if (type === "generate") {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-3", // ✅ FIXED
          messages: [
            {
              role: "system",
              content:
                "You are an expert interviewer. Ask one concise technical question.",
            },
            {
              role: "user",
              content: `Generate one ${role} interview question.`,
            },
          ],
        }),
      });

      const data = await res.json();
      console.log("GEN RESPONSE:", data); // 👈 DEBUG

      if (!res.ok) {
        return NextResponse.json(
          { error: data },
          { status: 500 }
        );
      }

      const questionText =
        data?.choices?.[0]?.message?.content ||
        "Failed to generate question.";

      return NextResponse.json({
        question: questionText,
      });
    }

    // 🔥 EVALUATE ANSWER
    if (type === "evaluate") {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-3", // ✅ FIXED
          messages: [
            {
              role: "system",
              content: `
You are an interviewer.

Return ONLY JSON:
{
  "score": number,
  "expected": "string",
  "feedback": "string"
}
`,
            },
            {
              role: "user",
              content: `Question: ${question}\nAnswer: ${answer}`,
            },
          ],
        }),
      });

      const data = await res.json();
      console.log("EVAL RESPONSE:", data); // 👈 DEBUG

      if (!res.ok) {
        return NextResponse.json(
          { error: data },
          { status: 500 }
        );
      }

      const raw = data?.choices?.[0]?.message?.content || "";

      let parsed;

      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch?.[0] || "");
      } catch (err) {
        console.error("PARSE ERROR:", raw);
        parsed = {
          score: 5,
          expected: "Parsing failed",
          feedback: "Try again",
        };
      }

      return NextResponse.json({
        result: parsed,
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (err) {
    console.error("AI ROUTE ERROR:", err); // 👈 SUPER IMPORTANT
    return NextResponse.json(
      { error: "AI failed" },
      { status: 500 }
    );
  }
}