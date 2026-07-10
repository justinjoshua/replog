import { Router } from "express";
import Workout from "../models/Workout.js";
import * as gemini from "../services/gemini.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/ai/status — lets the UI show whether AI features are available
router.get("/status", (req, res) => {
  res.json({ enabled: gemini.isEnabled() });
});

function requireAI(res) {
  if (!gemini.isEnabled()) {
    res.status(503).json({
      error:
        "AI features are off. Add GEMINI_API_KEY to server/.env and restart the server.",
    });
    return false;
  }
  return true;
}

// POST /api/ai/parse  { text } -> structured workout draft (not saved)
router.post("/parse", async (req, res, next) => {
  if (!requireAI(res)) return;
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "text is required" });
    res.json(await gemini.parseWorkout(text));
  } catch (e) {
    next(e);
  }
});

// POST /api/ai/generate  { goal, equipment, durationMin, muscles, level } -> plan (not saved)
router.post("/generate", async (req, res, next) => {
  if (!requireAI(res)) return;
  try {
    res.json(await gemini.generateWorkout(req.body || {}));
  } catch (e) {
    next(e);
  }
});

// POST /api/ai/exercise-guide { name, muscle, equipment } -> { tips, mistakes, setsReps }
router.post("/exercise-guide", async (req, res, next) => {
  if (!requireAI(res)) return;
  try {
    const { name, muscle, equipment } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: "name is required" });
    res.json(await gemini.exerciseGuide({ name, muscle, equipment }));
  } catch (e) {
    next(e);
  }
});

// POST /api/ai/coach -> markdown coaching report based on recent history
router.post("/coach", requireAuth, async (req, res, next) => {
  if (!requireAI(res)) return;
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 }).limit(20);
    if (!workouts.length)
      return res.json({ report: "Log a few workouts first and I'll analyze your progress." });
    res.json({ report: await gemini.coach(buildSummary(workouts)) });
  } catch (e) {
    next(e);
  }
});

// Compact, token-cheap summary of recent training for the coaching prompt.
function buildSummary(workouts) {
  const epley = (w, r) => (r > 0 ? w * (1 + r / 30) : 0);
  const perExercise = {};
  const sessions = workouts.map((w) => {
    let volume = 0;
    for (const ex of w.exercises) {
      for (const set of ex.sets) {
        volume += set.reps * set.weight;
        const e1rm = Math.round(epley(set.weight, set.reps));
        if (!perExercise[ex.name] || e1rm > perExercise[ex.name])
          perExercise[ex.name] = e1rm;
      }
    }
    return {
      date: w.date.toISOString().slice(0, 10),
      title: w.title,
      volume: Math.round(volume),
      exercises: w.exercises.map((e) => e.name),
    };
  });
  return { sessionCount: sessions.length, sessions, bestEstimated1RM: perExercise };
}

export default router;
