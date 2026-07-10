import { Router } from "express";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Stats are per-user.
router.use(requireAuth);

const volumeOf = (w) =>
  w.exercises.reduce(
    (t, ex) => t + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );

// Estimated 1-rep max (Epley formula), used for strength progression.
const epley = (weight, reps) => (reps > 0 ? weight * (1 + reps / 30) : 0);

// GET /api/stats/summary — dashboard headline numbers
router.get("/summary", async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 });
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 864e5);

    const thisWeek = workouts.filter((w) => w.date >= weekAgo);
    const totalVolume = workouts.reduce((t, w) => t + volumeOf(w), 0);
    const weekVolume = thisWeek.reduce((t, w) => t + volumeOf(w), 0);

    res.json({
      totalWorkouts: workouts.length,
      workoutsThisWeek: thisWeek.length,
      totalVolume,
      weekVolume,
      streak: currentStreak(workouts),
      lastWorkout: workouts[0]?.date ?? null,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/stats/volume?days=30 — daily volume time series for the chart
router.get("/volume", async (req, res, next) => {
  try {
    const days = Math.min(Number(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 864e5);
    const workouts = await Workout.find({ user: req.userId, date: { $gte: since } }).sort({ date: 1 });

    const byDay = new Map();
    for (const w of workouts) {
      const key = w.date.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + volumeOf(w));
    }
    res.json([...byDay.entries()].map(([date, volume]) => ({ date, volume })));
  } catch (e) {
    next(e);
  }
});

// GET /api/stats/prs — best estimated 1RM per exercise
router.get("/prs", async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.userId });
    const best = new Map(); // name -> { e1rm, weight, reps, date }
    for (const w of workouts) {
      for (const ex of w.exercises) {
        for (const set of ex.sets) {
          const e1rm = epley(set.weight, set.reps);
          const prev = best.get(ex.name);
          if (!prev || e1rm > prev.e1rm) {
            best.set(ex.name, {
              e1rm: Math.round(e1rm),
              weight: set.weight,
              reps: set.reps,
              date: w.date,
            });
          }
        }
      }
    }
    const prs = [...best.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.e1rm - a.e1rm);
    res.json(prs);
  } catch (e) {
    next(e);
  }
});

// GET /api/stats/exercise/:name — progression (best e1RM per session) for one lift
router.get("/exercise/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const workouts = await Workout.find({ user: req.userId, "exercises.name": name }).sort({ date: 1 });
    const series = [];
    for (const w of workouts) {
      let best = 0;
      for (const ex of w.exercises) {
        if (ex.name !== name) continue;
        for (const set of ex.sets) best = Math.max(best, epley(set.weight, set.reps));
      }
      if (best > 0)
        series.push({ date: w.date.toISOString().slice(0, 10), e1rm: Math.round(best) });
    }
    res.json(series);
  } catch (e) {
    next(e);
  }
});

function currentStreak(workoutsDescByDate) {
  if (!workoutsDescByDate.length) return 0;
  const days = new Set(
    workoutsDescByDate.map((w) => w.date.toISOString().slice(0, 10))
  );
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to start today or yesterday.
  if (!days.has(cursor.toISOString().slice(0, 10)))
    cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default router;
