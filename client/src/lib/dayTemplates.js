// Training "day" presets (splits). Each maps to the muscle groups that belong
// to that session, so the logger can show/build only the relevant movements —
// e.g. Chest Day => only chest work.
export const DAY_TEMPLATES = [
  { key: "chest", label: "Chest", icon: "shield", muscles: ["Chest"] },
  { key: "back", label: "Back", icon: "activity", muscles: ["Back"] },
  { key: "shoulders", label: "Shoulders", icon: "target", muscles: ["Shoulders"] },
  { key: "legs", label: "Legs", icon: "footprints", muscles: ["Legs", "Glutes"] },
  { key: "arms", label: "Arms", icon: "dumbbell", muscles: ["Biceps", "Triceps"] },
  { key: "push", label: "Push", icon: "chevronUp", muscles: ["Chest", "Shoulders", "Triceps"] },
  { key: "pull", label: "Pull", icon: "chevronDown", muscles: ["Back", "Biceps"] },
  { key: "core", label: "Core", icon: "flame", muscles: ["Core"] },
  { key: "fullbody", label: "Full Body", icon: "zap", muscles: ["Chest", "Back", "Legs", "Shoulders"] },
];

export const dayByKey = (key) => DAY_TEMPLATES.find((d) => d.key === key) || null;

// Muscle groups a user can combine into a custom split, and icon choices.
export const SPLIT_MUSCLES = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Glutes", "Core", "Cardio",
];
export const SPLIT_ICONS = ["star", "flame", "zap", "dumbbell", "footprints", "activity", "shield", "target", "heart"];

// Turn a name + muscles into a persistable split object.
export const makeSplit = (label, muscles, icon = "star") => ({
  key: "custom:" + label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  label: label.trim(),
  icon,
  muscles,
  custom: true,
});

const ISOLATION = new Set(["Biceps", "Triceps", "Core"]);

// Sensible default set/rep scheme: heavier compounds get more sets & lower reps,
// isolation gets higher reps. Weight starts at 0 for the user to fill in.
function defaultSets(ex) {
  const iso = ISOLATION.has(ex.muscleGroup);
  const count = iso ? 3 : 4;
  const reps = iso ? 12 : 8;
  return Array.from({ length: count }, () => ({ reps, weight: 0 }));
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Rank so a big compound tends to lead the session.
const compoundScore = (ex) =>
  (["Barbell", "Machine"].includes(ex.equipment) ? 2 : 0) +
  (ISOLATION.has(ex.muscleGroup) ? 0 : 1);

/**
 * Build a workout for a day from the full exercise library.
 * Options ("the data given by the user"): equipment filter and exercise count.
 * Picks one random variation per distinct movement so sessions stay fresh.
 */
export function buildDayPlan(library, { muscles, equipment = "Any", count = 5 }) {
  let pool = library.filter((e) => muscles.includes(e.muscleGroup));
  if (equipment && equipment !== "Any") {
    const filtered = pool.filter((e) => e.equipment === equipment);
    if (filtered.length) pool = filtered; // fall back to all if none match
  }
  if (!pool.length) return [];

  // One variation per base movement.
  const byGroup = new Map();
  for (const e of pool) {
    const key = e.group || e.name;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(e);
  }

  const picks = shuffle([...byGroup.values()])
    .slice(0, count)
    .map((vars) => vars[Math.floor(Math.random() * vars.length)])
    .sort((a, b) => compoundScore(b) - compoundScore(a));

  return picks.map((e) => ({
    name: e.name,
    muscleGroup: e.muscleGroup,
    equipment: e.equipment || "",
    notes: "",
    sets: defaultSets(e),
  }));
}
