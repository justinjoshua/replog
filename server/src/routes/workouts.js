import { Router } from "express";
import Workout from "../models/Workout.js";

const router = Router();

// GET /api/workouts?limit=50
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const workouts = await Workout.find().sort({ date: -1 }).limit(limit);
    res.json(workouts);
  } catch (e) {
    next(e);
  }
});

// GET /api/workouts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: "Not found" });
    res.json(workout);
  } catch (e) {
    next(e);
  }
});

// POST /api/workouts
router.post("/", async (req, res, next) => {
  try {
    const workout = await Workout.create(sanitize(req.body));
    res.status(201).json(workout);
  } catch (e) {
    next(e);
  }
});

// PUT /api/workouts/:id
router.put("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
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
    await Workout.findByIdAndDelete(req.params.id);
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
