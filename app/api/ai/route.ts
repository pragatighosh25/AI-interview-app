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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, question, answer, role, difficulty, count,resumeText } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    // 🔥 GENERATE QUESTIONS
if (type === "generate") {
  const total = count || 5;

  // 🆕 RESUME-BASED QUESTIONS FIRST
  if (resumeText) {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a senior technical interviewer.

Based on the candidate's resume below, generate ${total} personalized interview questions.

Resume:
${resumeText}

Rules:
- Focus on projects, skills, and technologies mentioned
- Ask practical and scenario-based questions
- Mix difficulty levels
- No generic questions
- No repetition

Return ONLY JSON array:
["q1","q2","q3"]
          `,
        },
      ],
    });

    const raw = completion.choices[0].message.content || "";

    let questions: string[] = [];

    try {
      const match = raw.match(/\[[\s\S]*\]/);
      questions = JSON.parse(match?.[0] || "[]");
    } catch {
      return NextResponse.json(
        { error: "Parsing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  }

  // 🔽 NORMAL ROLE FLOW (only if NOT resume)
  if (!role || !difficulty) {
    return NextResponse.json(
      { error: "Missing role or difficulty" },
      { status: 400 }
    );
  }

  const domainConfig: Record<string, string> = {
    Frontend: `...`,
    Backend: `...`,
    DSA: `...`,
    Design: `...`,
    DevOps: `...`,
    "Data Analyst": `...`,
  };

  if (!domainConfig[role]) {
    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 }
    );
  }

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a senior technical interviewer.

Generate ${total} interview questions.

Domain: ${role}
Difficulty: ${difficulty}

${domainConfig[role]}

Rules:
- Questions must be realistic
- Cover DIFFERENT topics
- Keep concise
- No repetition

Return ONLY JSON array:
["q1","q2","q3"]
        `,
      },
    ],
  });

  const raw = completion.choices[0].message.content || "";

  let questions: string[] = [];

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    questions = JSON.parse(match?.[0] || "[]");
  } catch {
    return NextResponse.json(
      { error: "Parsing failed" },
      { status: 500 }
    );
  }

  if (!questions.length) {
    return NextResponse.json(
      { error: "No questions generated" },
      { status: 500 }
    );
  }

  return NextResponse.json({ questions });
}

    // 🔥 EVALUATE
    if (type === "evaluate") {
      if (!question || !answer) {
        return NextResponse.json(
          { error: "Missing question or answer" },
          { status: 400 }
        );
      }

      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
Return ONLY JSON:
{
  "score": number,
  "expected": "ideal answer",
  "feedback": "what was good + improvements"
}
            `,
          },
          {
            role: "user",
            content: `Q: ${question}\nA: ${answer}`,
          },
        ],
      });

      const raw = completion.choices[0].message.content || "";

      let parsed;

      try {
        const match = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(match?.[0] || "");
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
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}