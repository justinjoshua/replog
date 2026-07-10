import { GoogleGenAI } from "@google/genai";

/**
 * Thin wrapper around Google Gemini. Every function degrades gracefully:
 * if GEMINI_API_KEY is missing, `isEnabled()` is false and callers return a
 * friendly message instead of crashing.
 */
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export function isEnabled() {
  return Boolean(ai);
}

/** Ask Gemini for JSON and parse it, tolerating ```json fences. */
async function generateJSON(prompt) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });
  const text = res.text ?? "";
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  }
}

/** Plain-text generation (for the coaching summary). */
async function generateText(prompt) {
  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  return res.text ?? "";
}

/**
 * Parse a free-text description of a workout into structured exercises/sets.
 * e.g. "3x8 bench press at 60kg, then 4x10 rows at 40" -> structured JSON.
 */
export async function parseWorkout(text) {
  const prompt = `You are a fitness logging assistant. Convert the user's free-text
workout description into structured JSON. Weights are in kilograms; if a weight
looks like pounds, still record the number as given.

Return ONLY JSON of this exact shape:
{
  "title": "short title",
  "exercises": [
    { "name": "Exercise Name",
      "muscleGroup": "one of: Chest, Back, Shoulders, Biceps, Triceps, Legs, Glutes, Core, Cardio, Full Body, Other",
      "sets": [ { "reps": number, "weight": number } ] }
  ]
}
Expand shorthand like "3x8 @ 60" into 3 sets of 8 reps at weight 60.

User description: """${text}"""`;
  return generateJSON(prompt);
}

/** Generate a workout plan from goals/constraints. */
export async function generateWorkout({ goal, equipment, durationMin, muscles, level }) {
  const prompt = `You are a certified strength coach. Design ONE workout session.

Constraints:
- Goal: ${goal || "general strength & hypertrophy"}
- Available equipment: ${equipment || "any"}
- Target time: ${durationMin || 45} minutes
- Focus muscles: ${muscles || "trainer's choice"}
- Experience level: ${level || "intermediate"}

Return ONLY JSON of this exact shape:
{
  "title": "session title",
  "notes": "1-2 sentence coaching note",
  "exercises": [
    { "name": "Exercise Name",
      "muscleGroup": "one of: Chest, Back, Shoulders, Biceps, Triceps, Legs, Glutes, Core, Cardio, Full Body, Other",
      "sets": [ { "reps": number, "weight": 0 } ] }
  ]
}
Use weight 0 (user fills in their own load). Give realistic set/rep schemes.`;
  return generateWorkoutJSON(prompt);
}

async function generateWorkoutJSON(prompt) {
  return generateJSON(prompt);
}

/** Form tips + common mistakes + a set/rep suggestion for one exercise. */
export async function exerciseGuide({ name, muscle, equipment }) {
  const prompt = `You are a certified strength coach. For the exercise "${name}"
(primary muscle: ${muscle || "n/a"}, equipment: ${equipment || "n/a"}), return ONLY JSON:
{
  "tips": ["3-4 concise proper-form cues, each under 14 words"],
  "mistakes": ["3-4 common mistakes to avoid, each under 14 words"],
  "setsReps": "one short recommendation, e.g. '3-4 sets x 8-12 reps'"
}`;
  return generateJSON(prompt);
}

/**
 * Analyze recent workout history and return coaching feedback (markdown text).
 * `summary` is a compact stats object built by the caller.
 */
export async function coach(summary) {
  const prompt = `You are an encouraging but honest strength coach. Based on this
JSON summary of the user's recent training, write a short markdown report with:
1. A one-line overall assessment.
2. 2-4 specific observations (progress, plateaus, imbalances, volume trends).
3. 2-3 concrete, actionable suggestions for the next 1-2 weeks.
Keep it under 200 words. Be specific and reference their numbers.

Training summary JSON:
${JSON.stringify(summary, null, 2)}`;
  return generateText(prompt);
}
