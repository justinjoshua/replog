// Built-in workout programs (splits). Composed from reusable day templates so
// the data stays DRY. Exercise names match the app's library where possible, so
// covers/GIFs resolve and "Start Program" can queue them into the logger.

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=560&q=72`;
const e = (name, sets, reps, rest) => ({ name, sets, reps, rest });

// ---- Reusable training days ----
const DAYS = {
  push: { label: "Push", exercises: [
    e("Flat Barbell Bench Press", 4, "6–8", "2–3 min"),
    e("Incline Dumbbell Press", 3, "8–12", "90s"),
    e("Barbell Overhead Press", 3, "8–10", "2 min"),
    e("Dumbbell Lateral Raise", 3, "12–15", "60s"),
    e("Rope Pushdown", 3, "12–15", "60s"),
    e("Overhead Rope Extension", 3, "12–15", "60s"),
  ]},
  pull: { label: "Pull", exercises: [
    e("Pull-Up", 4, "6–10", "2 min"),
    e("Barbell Row", 4, "6–8", "2 min"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s"),
    e("Face Pull", 3, "15–20", "60s"),
    e("Hammer Curl", 3, "10–12", "60s"),
    e("EZ-Bar Curl", 3, "10–12", "60s"),
  ]},
  legs: { label: "Legs", exercises: [
    e("Back Squat", 4, "6–8", "3 min"),
    e("Romanian Deadlift", 3, "8–10", "2 min"),
    e("Leg Press", 3, "10–12", "90s"),
    e("Walking Lunge", 3, "10–12", "90s"),
    e("Seated Leg Curl Machine", 3, "12–15", "60s"),
    e("Standing Calf Raise Machine", 4, "12–15", "60s"),
  ]},
  upper: { label: "Upper", exercises: [
    e("Flat Barbell Bench Press", 4, "6–8", "2–3 min"),
    e("Barbell Row", 4, "6–8", "2–3 min"),
    e("Barbell Overhead Press", 3, "8–10", "2 min"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s"),
    e("Dumbbell Lateral Raise", 3, "12–15", "60s"),
    e("Barbell Curl", 3, "10–12", "60s"),
    e("Rope Pushdown", 3, "12–15", "60s"),
  ]},
  lower: { label: "Lower", exercises: [
    e("Back Squat", 4, "6–8", "3 min"),
    e("Romanian Deadlift", 3, "8–10", "2 min"),
    e("Leg Press", 3, "10–12", "90s"),
    e("Seated Leg Curl Machine", 3, "12–15", "60s"),
    e("Leg Extension Machine", 3, "12–15", "60s"),
    e("Standing Calf Raise Machine", 4, "12–15", "60s"),
  ]},
  fullA: { label: "Full Body A", exercises: [
    e("Back Squat", 3, "8–10", "2 min"),
    e("Flat Barbell Bench Press", 3, "8–10", "2 min"),
    e("Barbell Row", 3, "8–10", "2 min"),
    e("Barbell Overhead Press", 2, "10–12", "90s"),
    e("Plank", 3, "45s", "45s"),
  ]},
  fullB: { label: "Full Body B", exercises: [
    e("Romanian Deadlift", 3, "8–10", "2 min"),
    e("Incline Dumbbell Press", 3, "10–12", "90s"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s"),
    e("Dumbbell Lateral Raise", 3, "12–15", "60s"),
    e("Hanging Leg Raise", 3, "10–15", "60s"),
  ]},
  fullC: { label: "Full Body C", exercises: [
    e("Leg Press", 3, "10–12", "90s"),
    e("Dumbbell Bench Press", 3, "10–12", "90s"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s"),
    e("Barbell Curl", 2, "12–15", "60s"),
    e("Rope Pushdown", 2, "12–15", "60s"),
  ]},
  arnoldCB: { label: "Chest & Back", exercises: [
    e("Flat Barbell Bench Press", 4, "8–10", "2 min"),
    e("Incline Dumbbell Press", 3, "10–12", "90s"),
    e("Pull-Up", 4, "8–10", "2 min"),
    e("Barbell Row", 3, "8–10", "2 min"),
    e("Cable Fly", 3, "12–15", "60s"),
    e("Seated Cable Row (Wide)", 3, "12–15", "60s"),
  ]},
  arnoldSA: { label: "Shoulders & Arms", exercises: [
    e("Barbell Overhead Press", 4, "8–10", "2 min"),
    e("Dumbbell Lateral Raise", 4, "12–15", "60s"),
    e("Face Pull", 3, "15–20", "60s"),
    e("Barbell Curl", 3, "10–12", "60s"),
    e("Rope Pushdown", 3, "12–15", "60s"),
    e("Hammer Curl", 3, "10–12", "60s"),
  ]},
  broChest: { label: "Chest", exercises: [
    e("Flat Barbell Bench Press", 4, "6–10", "2–3 min"),
    e("Incline Dumbbell Press", 4, "8–12", "90s"),
    e("Cable Fly", 3, "12–15", "60s"),
    e("Chest Dip", 3, "10–12", "90s"),
    e("Pec Deck Machine", 3, "12–15", "60s"),
  ]},
  broBack: { label: "Back", exercises: [
    e("Conventional Deadlift", 4, "5–6", "3 min"),
    e("Pull-Up", 4, "8–10", "2 min"),
    e("Barbell Row", 4, "8–10", "2 min"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s"),
    e("Barbell Shrug", 3, "12–15", "60s"),
  ]},
  broShoulders: { label: "Shoulders", exercises: [
    e("Barbell Overhead Press", 4, "8–10", "2 min"),
    e("Dumbbell Lateral Raise", 4, "12–15", "60s"),
    e("Reverse Pec Deck Machine", 3, "15–20", "60s"),
    e("Barbell Upright Row", 3, "10–12", "90s"),
    e("Face Pull", 3, "15–20", "60s"),
  ]},
  broArms: { label: "Arms", exercises: [
    e("Barbell Curl", 4, "8–12", "60s"),
    e("EZ-Bar Curl", 3, "10–12", "60s"),
    e("Hammer Curl", 3, "10–12", "60s"),
    e("Rope Pushdown", 4, "10–15", "60s"),
    e("Overhead Rope Extension", 3, "12–15", "60s"),
    e("Bench Dip", 3, "12–15", "60s"),
  ]},
  powerUpper: { label: "Power Upper", exercises: [
    e("Flat Barbell Bench Press", 5, "5", "3 min"),
    e("Barbell Row", 5, "5", "3 min"),
    e("Barbell Overhead Press", 3, "6–8", "2 min"),
    e("Pull-Up", 3, "6–8", "2 min"),
    e("Incline Dumbbell Press", 3, "8–12", "90s"),
    e("Barbell Curl", 3, "10–12", "60s"),
  ]},
  powerLower: { label: "Power Lower", exercises: [
    e("Back Squat", 5, "5", "3 min"),
    e("Conventional Deadlift", 3, "5", "3 min"),
    e("Leg Press", 3, "8–10", "2 min"),
    e("Romanian Deadlift", 3, "8", "2 min"),
    e("Standing Calf Raise Machine", 4, "12–15", "60s"),
  ]},
  strengthSquat: { label: "Squat Focus", exercises: [
    e("Back Squat", 5, "5", "3–4 min"),
    e("Leg Press", 3, "8–10", "2 min"),
    e("Romanian Deadlift", 3, "8", "2 min"),
    e("Leg Extension Machine", 3, "12–15", "60s"),
    e("Standing Calf Raise Machine", 4, "12–15", "60s"),
  ]},
  strengthBench: { label: "Bench Focus", exercises: [
    e("Flat Barbell Bench Press", 5, "5", "3–4 min"),
    e("Barbell Overhead Press", 3, "6", "2 min"),
    e("Incline Dumbbell Press", 3, "8", "2 min"),
    e("Rope Pushdown", 3, "12", "60s"),
    e("Dumbbell Lateral Raise", 3, "15", "60s"),
  ]},
  strengthDead: { label: "Deadlift Focus", exercises: [
    e("Conventional Deadlift", 5, "3", "4 min"),
    e("Barbell Row", 4, "6", "2 min"),
    e("Pull-Up", 3, "8", "2 min"),
    e("Lat Pulldown (Wide Grip)", 3, "10", "90s"),
    e("Barbell Curl", 3, "12", "60s"),
  ]},
  athleticA: { label: "Strength & Power", exercises: [
    e("Back Squat", 4, "5", "3 min"),
    e("Flat Barbell Bench Press", 4, "6", "2 min"),
    e("Barbell Row", 3, "8", "2 min"),
    e("Walking Lunge", 3, "12", "90s"),
    e("Plank", 3, "45s", "45s"),
  ]},
  athleticB: { label: "Explosive & Core", exercises: [
    e("Romanian Deadlift", 4, "6", "2 min"),
    e("Barbell Overhead Press", 3, "8", "2 min"),
    e("Pull-Up", 3, "8", "2 min"),
    e("Dumbbell Bench Press", 3, "10", "90s"),
    e("Hanging Leg Raise", 3, "12", "60s"),
  ]},
};

const WARMUP = [
  "5–10 min light cardio (bike, row or brisk walk) to raise core temperature.",
  "Dynamic mobility for the joints you'll train (hips, shoulders, ankles).",
  "2–3 progressively heavier warm-up sets on your first big lift.",
];
const COOLDOWN = [
  "3–5 min easy cardio to bring your heart rate down.",
  "Static stretching for the muscles trained, ~30s each.",
  "Hydrate and log your sets while they're fresh.",
];
const TIPS = {
  Beginner: [
    "Focus on form before adding weight — quality reps build the foundation.",
    "Rest fully between hard sets; you're training strength, not cardio.",
    "Consistency beats intensity — showing up 3× a week is the real win.",
  ],
  Intermediate: [
    "Track your top sets and aim to beat them slightly each week.",
    "Keep 1–3 reps in reserve on most sets to manage fatigue.",
    "Prioritize compounds first while you're freshest.",
  ],
  Advanced: [
    "Auto-regulate: push heavy on good days, back off when recovery is poor.",
    "Rotate intensity across the week to peak the main lifts.",
    "Deload every 4–6 weeks to keep progressing long-term.",
  ],
};
const OVERLOAD =
  "Add ~2.5kg to a lift once you hit the top of the rep range on all sets, then work back up the range. When weight stalls, add a set or a rep before forcing load. Log every session so progress is measurable, not guessed.";

// ---- Programs ----
const R = "rest";
const P = [
  { id: "full-body-3", name: "Full Body", level: "Beginner", daysPerWeek: 3, duration: "45–60 min",
    goal: "Muscle Gain", tags: ["Home", "Gym", "Fat Loss"], cover: U("1571019613454-1cb2f99b2d8b"),
    description: "The perfect starting point — hit every major muscle three times a week with simple, effective compound lifts.",
    week: ["fullA", R, "fullB", R, "fullC", R, R] },
  { id: "upper-lower-4", name: "Upper / Lower", level: "Beginner", daysPerWeek: 4, duration: "50–65 min",
    goal: "Muscle Gain", tags: ["Gym"], cover: U("1517963879433-6ad2b056d712"),
    description: "Four focused days splitting the body into upper and lower — more volume once full-body feels easy.",
    week: ["upper", "lower", R, "upper", "lower", R, R] },
  { id: "ppl-3", name: "Push / Pull / Legs (3-Day)", level: "Beginner", daysPerWeek: 3, duration: "50–70 min",
    goal: "Muscle Gain", tags: ["Home", "Gym"], cover: U("1534438327276-14e5300c3a48"),
    description: "The classic PPL at a beginner-friendly 3 days a week — one push, one pull, one legs.",
    week: ["push", R, "pull", R, "legs", R, R] },
  { id: "ppl-6", name: "Push / Pull / Legs (6-Day)", level: "Beginner", daysPerWeek: 6, duration: "50–70 min",
    goal: "Muscle Gain", tags: ["Gym", "Fat Loss"], cover: U("1583454110551-21f2fa2afe61"),
    description: "Each muscle twice a week for faster growth once you can recover from higher frequency.",
    week: ["push", "pull", "legs", "push", "pull", "legs", R] },

  { id: "ppl-int", name: "Push / Pull / Legs", level: "Intermediate", daysPerWeek: 6, duration: "60–75 min",
    goal: "Muscle Gain", tags: ["Gym"], cover: U("1581009146145-b5ef050c2e1e"),
    description: "High-frequency hypertrophy: six sessions, heavy compounds plus targeted isolation.",
    week: ["push", "pull", "legs", "push", "pull", "legs", R] },
  { id: "arnold", name: "Arnold Split", level: "Intermediate", daysPerWeek: 6, duration: "60–80 min",
    goal: "Muscle Gain", tags: ["Gym"], cover: U("1594737625785-a6cbdabd333c"),
    description: "Chest & back, shoulders & arms, then legs — Arnold's high-volume classic for serious size.",
    week: ["arnoldCB", "arnoldSA", "legs", "arnoldCB", "arnoldSA", "legs", R] },
  { id: "upper-lower-int", name: "Upper / Lower", level: "Intermediate", daysPerWeek: 4, duration: "60–75 min",
    goal: "Strength", tags: ["Gym"], cover: U("1541534741688-6078c6bfb5c5"),
    description: "Four heavy days balancing strength and size across upper and lower body.",
    week: ["upper", "lower", R, "upper", "lower", R, R] },
  { id: "strength-hyp", name: "Strength & Hypertrophy", level: "Intermediate", daysPerWeek: 4, duration: "65–80 min",
    goal: "Strength", tags: ["Gym"], cover: U("1517836357463-d25dfeac3438"),
    description: "Two power days on the big lifts, two hypertrophy days for volume — the best of both.",
    week: ["powerUpper", "powerLower", R, "upper", "lower", R, R] },

  { id: "bro-split", name: "Body Part Split (Bro Split)", level: "Advanced", daysPerWeek: 5, duration: "60–75 min",
    goal: "Muscle Gain", tags: ["Gym"], cover: U("1584466977773-e625c37cdd50"),
    description: "One muscle group per day, trained to exhaustion — maximum volume and focus per session.",
    week: ["broChest", "broBack", "broShoulders", "broArms", "legs", R, R] },
  { id: "powerbuilding", name: "Powerbuilding", level: "Advanced", daysPerWeek: 5, duration: "70–90 min",
    goal: "Strength", tags: ["Gym"], cover: U("1546483875-ad9014c88eba"),
    description: "Squat, bench and deadlift strength work paired with bodybuilding accessories for size and power.",
    week: ["strengthBench", "strengthSquat", R, "arnoldCB", "strengthDead", R, R] },
  { id: "strength-focus", name: "Strength Focus", level: "Advanced", daysPerWeek: 3, duration: "60–90 min",
    goal: "Strength", tags: ["Gym"], cover: U("1518611012118-696072aa579a"),
    description: "A 5×5-style program built around the three big lifts for raw, measurable strength.",
    week: ["strengthSquat", R, "strengthBench", R, "strengthDead", R, R] },
  { id: "athletic", name: "Athletic Performance", level: "Advanced", daysPerWeek: 4, duration: "45–60 min",
    goal: "Endurance", tags: ["Home", "Gym", "Fat Loss"], cover: U("1526506118085-60ce8714f8c5"),
    description: "Power, explosiveness and conditioning for athletes who want to perform, not just look strong.",
    week: ["athleticA", R, "athleticB", R, "athleticA", R, R] },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Hydrate a program with its resolved days, schedule, and shared guidance.
export function getProgram(id) {
  const p = P.find((x) => x.id === id);
  if (!p) return null;
  const schedule = p.week.map((k, i) => ({
    day: WEEKDAYS[i],
    rest: k === R,
    label: k === R ? "Rest" : DAYS[k].label,
    key: k,
  }));
  const seen = new Set();
  const dayDefs = [];
  for (const k of p.week) {
    if (k === R || seen.has(k)) continue;
    seen.add(k);
    dayDefs.push({ key: k, ...DAYS[k] });
  }
  return { ...p, schedule, dayDefs, warmup: WARMUP, cooldown: COOLDOWN, tips: TIPS[p.level], overload: OVERLOAD };
}

export const PROGRAMS = P;
export const LEVELS = ["Beginner", "Intermediate", "Advanced"];
export const GOALS = ["Muscle Gain", "Strength", "Fat Loss", "Endurance"];
export const LOCATIONS = ["Gym", "Home"];
export const GOAL_COLOR = {
  "Muscle Gain": "var(--accent)",
  Strength: "#f59e0b",
  "Fat Loss": "#ef4444",
  Endurance: "#10b981",
};
