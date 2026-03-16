import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"

const MAX_DOCUMENT_CONTEXT_LENGTH = 3000

const SYSTEM_PROMPT = `You are an expert Scottish Physics Tutor for National 5, Higher, and Advanced Higher.
You generate physics calculation questions that match SQA curriculum standards exactly.
You must return ONLY a valid JSON array — no other text, no markdown, no explanations.

Each question must follow one of two formats:

For EASY difficulty (multiple-choice):
{
  "id": "unique-string-id",
  "stem": "Question text with specific numbers",
  "equation": "Formula used e.g. F = ma",
  "options": ["option A", "option B", "option C", "option D"],
  "correctOption": 0,
  "markScheme": "Step-by-step worked solution"
}

For MEDIUM or HARD difficulty (typed answer):
{
  "id": "unique-string-id",
  "stem": "Question text with specific numbers",
  "equation": "Formula used or rearranged form",
  "correctAnswer": "numerical answer with unit e.g. 15 N",
  "markScheme": "Step-by-step worked solution"
}

Rules:
- Generate exactly 15 questions
- Use realistic numbers appropriate for SQA physics
- Each question must have different numbers/scenarios
- Easy: straightforward substitution, no rearranging needed
- Medium: rearranging required, standard numbers
- Hard: rearranging required, unit conversions, complex numbers
- Mark schemes must show all working steps clearly
- correctOption is the 0-based index of the correct option in the options array`

export async function POST(request: Request) {
  try {
    const { equationId, equationFormula, equationDescription, difficulty, documentContext } = await request.json()

    const contextSection = documentContext
      ? `\n\nAdditional context from uploaded document:\n${documentContext.slice(0, MAX_DOCUMENT_CONTEXT_LENGTH)}`
      : ""

    const prompt = `Generate exactly 15 ${difficulty.toUpperCase()} difficulty physics calculation questions for the equation:
Formula: ${equationFormula}
Description: ${equationDescription}
Equation ID: ${equationId}${contextSection}

Requirements:
- All 15 questions must use the equation: ${equationFormula}
- Difficulty: ${difficulty} (${
      difficulty === "easy"
        ? "multiple-choice, straightforward substitution, nice round numbers"
        : difficulty === "medium"
          ? "typed answer, rearranging required, standard numbers"
          : "typed answer, rearranging required, unit conversions and complex numbers"
    })
- Vary the context/scenario for each question (different objects, situations, contexts)
- Make each question unique with different numerical values
- IDs must be unique, use format: "${equationId}-ai-${difficulty}-1" through "${equationId}-ai-${difficulty}-15"

Return ONLY the JSON array of 15 questions, nothing else.`

    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt,
    })

    // Extract the outermost JSON array from the response (first '[' to last ']')
    const start = text.indexOf("[")
    const end = text.lastIndexOf("]")
    if (start === -1 || end === -1 || end <= start) {
      return Response.json({ error: "Failed to parse generated questions" }, { status: 500 })
    }
    const jsonText = text.slice(start, end + 1)
    const questions = JSON.parse(jsonText)

    if (!Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: "Invalid questions format" }, { status: 500 })
    }

    return Response.json({ questions })
  } catch (error) {
    console.error("Error generating calc questions:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
