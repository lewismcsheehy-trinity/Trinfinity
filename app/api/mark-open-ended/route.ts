import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { question, answer, markingScheme, maxMarks } = await req.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ feedback: "AI marking unavailable — no API key configured.", score: null })
    }

    const prompt = `You are a Scottish exam marker for SQA exams. Mark this student's answer.

Question: ${question}

Student's Answer: ${answer}

Marking Scheme (${maxMarks} marks total): ${markingScheme}

Provide:
1. A score out of ${maxMarks} (must be a whole number)
2. Specific feedback on what was good, what was missing, and how to improve

Respond in JSON format: { "score": <number>, "feedback": "<feedback text>" }`

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices?.[0]?.message?.content
    if (content) {
      const parsed = JSON.parse(content)
      const rawScore = Number(parsed.score)
      if (isNaN(rawScore)) {
        return NextResponse.json({ feedback: parsed.feedback || "Marking complete.", score: null })
      }
      return NextResponse.json({
        score: Math.min(Math.max(0, Math.round(rawScore)), maxMarks),
        feedback: parsed.feedback || "Marking complete.",
      })
    }
    return NextResponse.json({ feedback: "Could not parse AI response.", score: null })
  } catch (err) {
    console.error("mark-open-ended error:", err)
    return NextResponse.json({ feedback: "AI marking failed. Please self-assess.", score: null })
  }
}
