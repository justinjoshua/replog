import { Router } from "express";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All workout routes are per-user.
router.use(requireAuth);

// GET /api/workouts?limit=50
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 }).limit(limit);
    res.json(workouts);
  } catch (e) {
    next(e);
  }
});

// GET /api/workouts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ error: "Not found" });
    res.json(workout);
  } catch (e) {
    next(e);
  }
});

// POST /api/workouts
router.post("/", async (req, res, next) => {
  try {
    const workout = await Workout.create({ ...sanitize(req.body), user: req.userId });
    res.status(201).json(workout);
  } catch (e) {
    next(e);
  }
});

// PUT /api/workouts/:id
router.put("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      sanitize(req.body),
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ error: "Not found" });
    res.json(workout);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/workouts/:id
router.delete("/:id", async (req, res, next) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

function sanitize(body = {}) {
  const out = {
    title: body.title,
    notes: body.notes,
    durationMin: body.durationMin,
    exercises: Array.isArray(body.exercises) ? body.exercises : [],
  };
  if (body.date) out.date = new Date(body.date);
  return out;
}

export default router;
