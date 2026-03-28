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
    const { type, question, answer, role, difficulty, count } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    // 🔥 GENERATE MULTIPLE QUESTIONS
    if (type === "generate") {
      if (!role || !difficulty) {
        return NextResponse.json(
          { error: "Missing role or difficulty" },
          { status: 400 }
        );
      }

      const total = count || 5;

      // 🎯 DOMAIN CONFIG (SCALABLE)
      const domainConfig: Record<string, string> = {
        Frontend: `
Focus on:
- JavaScript (closures, async/await, promises)
- React (hooks, state, lifecycle)
- DOM, browser behavior

STRICT:
- NO UI/UX design questions
- NO system design
- Focus on coding + concepts
`,

        Backend: `
Focus on:
- Node.js, APIs, databases
- Authentication, REST, server logic

STRICT:
- NO system design architecture questions
- Focus on implementation + backend concepts
`,

        DSA: `
Focus on:
- Data structures and algorithms
- Arrays, trees, graphs, dynamic programming

STRICT:
- Must be problem-solving or coding questions
`,

        Design: `
Focus on:
- System design
- UI/UX design
- Scalability, architecture, user experience

ALLOW:
- High-level thinking
- Trade-offs
- Real-world system questions
`,

        DevOps: `
Focus on:
- CI/CD pipelines
- Docker, Kubernetes
- Deployment, monitoring, scaling

STRICT:
- Focus on real-world infrastructure scenarios
- Avoid pure theory
`,

  "Data Analyst": `
Focus on:
- SQL queries
- Data cleaning and analysis
- Statistics basics
- Business insights

STRICT:
- Include practical scenarios
- Avoid pure theory-only questions
`,
      };

      const domainInstruction =
        domainConfig[role] || "General technical interview questions";

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

${domainInstruction}

General Rules:
- Questions must be realistic and non-repetitive
- Cover DIFFERENT topics
- Keep them concise
- Avoid repeating same concept

Return ONLY a valid JSON array:
["question1", "question2", ...]
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
          { error: "Failed to parse questions" },
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

    // 🔥 EVALUATE ANSWER
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
You are a senior technical interviewer evaluating a candidate.

Return ONLY JSON:
{
  "score": number (0-10),
  "expected": "A strong ideal answer",
  "feedback": "What was good, what was missing, and how to improve"
}

Scoring Guide:
- 9-10: Excellent
- 7-8: Good
- 5-6: Average
- 3-4: Weak
- 0-2: Incorrect

Feedback Rules:
- Be constructive
- Mention strengths
- Mention missing points
- Suggest improvements
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
    console.error("AI Route Error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}