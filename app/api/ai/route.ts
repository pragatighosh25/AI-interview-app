import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    // 🔐 AUTH CHECK
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, question, answer, role, difficulty } = body;

    // ❌ basic validation
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    // 🔥 GENERATE QUESTION
    if (type === "generate") {
      if (!role || !difficulty) {
        return NextResponse.json(
          { error: "Missing role or difficulty" },
          { status: 400 },
        );
      }

      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are a senior technical interviewer.

Generate exactly ONE high-quality interview question.

Rules:
- Domain: ${role}
- Difficulty: ${difficulty}
- The question should be realistic and asked in real interviews
- Do NOT include explanation or answer
- Keep it concise but meaningful
- Avoid generic or vague questions

Return ONLY the question text.
      `,
          },
        ],
      });

      const question = completion?.choices?.[0]?.message?.content?.trim();

      if (!question) {
        return NextResponse.json(
          { error: "AI failed to generate question" },
          { status: 500 },
        );
      }

      return NextResponse.json({ question });
    }

    // 🔥 EVALUATE ANSWER
    if (type === "evaluate") {
      if (!question || !answer) {
        return NextResponse.json(
          { error: "Missing question or answer" },
          { status: 400 },
        );
      }

      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are a senior technical interviewer evaluating a candidate.

Evaluate the answer strictly.

Return ONLY JSON in this format:
{
  "score": number (0-10),
  "expected": "A strong ideal answer to the question",
  "feedback": "Detailed feedback including: 
    - what was correct
    - what was missing
    - how it could be improved"
}

Scoring Guidelines:
- 9-10: Excellent, nearly perfect
- 7-8: Good, minor gaps
- 5-6: Average, missing key points
- 3-4: Weak understanding
- 0-2: Incorrect or irrelevant

Feedback Rules:
- Be constructive, not harsh
- Mention specific improvements
- Keep it clear and useful

Do NOT return anything except JSON.
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

      return NextResponse.json({ result: parsed });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("AI Route Error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
