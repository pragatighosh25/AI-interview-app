import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // 🔥 important
});

export async function POST(req: Request) {
  try {
    const { type, question, answer, role, difficulty } = await req.json();

    // 🔥 GENERATE QUESTION
    if (type === "generate") {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert interviewer. Ask ONE concise technical interview question. Only return the question text.",
      },
      {
        role: "user",
        content: `Generate one ${difficulty} level ${role} interview question.`,
      },
    ],
  });

  const question = completion?.choices?.[0]?.message?.content?.trim();

  if (!question) {
    throw new Error("No question returned from AI");
  }

  return NextResponse.json({ question });
}

    // 🔥 EVALUATE ANSWER
    if (type === "evaluate") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
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
      });

      const raw = completion.choices[0].message.content || "";

      let parsed;

      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch?.[0] || "");
      } catch {
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

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "AI failed" },
      { status: 500 }
    );
  }
}