import { Router } from "express";
import Exercise from "../models/Exercise.js";

const router = Router();

// Build a Mongo filter from shared query params (?muscle=&equipment=&q=).
function buildFilter({ muscle, equipment, q }) {
  const filter = {};
  if (muscle) filter.muscleGroup = muscle;
  if (equipment) filter.equipment = equipment;
  if (q) filter.name = { $regex: q, $options: "i" };
  return filter;
}

// GET /api/exercises?muscle=Chest&equipment=Barbell&q=bench
router.get("/", async (req, res, next) => {
  try {
    const exercises = await Exercise.find(buildFilter(req.query)).sort({ name: 1 });
    res.json(exercises);
  } catch (e) {
    next(e);
  }
});

// GET /api/exercises/groups — variations clustered by base movement.
// Powers the "view / switch / randomize variation" UI.
router.get("/groups", async (req, res, next) => {
  try {
    const exercises = await Exercise.find(buildFilter(req.query)).sort({ name: 1 });
    const byGroup = new Map();
    for (const ex of exercises) {
      const key = ex.group || ex.name;
      if (!byGroup.has(key)) {
        byGroup.set(key, {
          group: key,
          muscleGroup: ex.muscleGroup,
          icon: ex.icon,
          variations: [],
        });
      }
      byGroup.get(key).variations.push(ex);
    }
    // Movements with the most variations first — feels curated.
    const groups = [...byGroup.values()].sort(
      (a, b) => b.variations.length - a.variations.length
    );
    res.json(groups);
  } catch (e) {
    next(e);
  }
});

// POST /api/exercises
router.post("/", async (req, res, next) => {
  try {
    const { name, group, muscleGroup, secondaryMuscles, equipment, difficulty, icon } =
      req.body;
    if (!name?.trim()) return res.status(400).json({ error: "name is required" });
    const exercise = await Exercise.create({
      name: name.trim(),
      group: group?.trim() || name.trim(),
      muscleGroup,
      secondaryMuscles: Array.isArray(secondaryMuscles) ? secondaryMuscles : [],
      equipment,
      difficulty,
      icon,
      isCustom: true,
    });
    res.status(201).json(exercise);
  } catch (e) {
    if (e.code === 11000)
      return res.status(409).json({ error: "That exercise already exists" });
    next(e);
  }
});

// DELETE /api/exercises/:id
router.delete("/:id", async (req, res, next) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
