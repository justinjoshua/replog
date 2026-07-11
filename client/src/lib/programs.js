// Built-in workout programs (splits). Composed from reusable day templates so
// the data stays DRY. Exercise names match the app's library where possible, so
// covers/GIFs resolve and "Start Program" can queue them into the logger.

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=560&q=72`;
// rir = reps in reserve (how many reps to leave short of failure).
const e = (name, sets, reps, rest, rir = "1–2") => ({ name, sets, reps, rest, rir });

// ---- Reusable training days ----
// Programming follows current hypertrophy/strength evidence: compounds first,
// ~10–20 hard sets per muscle per week (across the split), most work at 1–3 RIR
// with isolation taken closer to failure, and rep ranges matched to the goal.
const DAYS = {
  push: { label: "Push", exercises: [
    e("Flat Barbell Bench Press", 4, "5–8", "2–3 min", "2–3"),
    e("Incline Dumbbell Press", 3, "8–12", "90s", "1–2"),
    e("Dumbbell Shoulder Press", 3, "8–12", "90s", "1–2"),
    e("Cable Lateral Raise", 3, "12–20", "45s", "0–1"),
    e("Overhead Rope Extension", 3, "10–15", "60s", "0–2"),
    e("Rope Pushdown", 2, "12–15", "45s", "0–1"),
  ]},
  pull: { label: "Pull", exercises: [
    e("Pull-Up", 4, "6–10", "2 min", "2–3"),
    e("Barbell Row", 3, "8–10", "2 min", "1–2"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s", "1–2"),
    e("Face Pull", 3, "15–20", "45s", "0–1"),
    e("Incline Dumbbell Curl", 3, "10–12", "60s", "0–1"),
    e("Hammer Curl", 2, "10–12", "60s", "0–1"),
  ]},
  legs: { label: "Legs", exercises: [
    e("Back Squat", 4, "5–8", "3 min", "2–3"),
    e("Romanian Deadlift", 3, "8–10", "2 min", "1–2"),
    e("Leg Press", 3, "10–12", "90s", "1–2"),
    e("Seated Leg Curl Machine", 3, "10–15", "60s", "0–2"),
    e("Leg Extension Machine", 3, "12–15", "60s", "0–1"),
    e("Standing Calf Raise Machine", 4, "10–15", "45s", "0–1"),
  ]},
  upper: { label: "Upper", exercises: [
    e("Flat Barbell Bench Press", 4, "5–8", "2–3 min", "2–3"),
    e("Barbell Row", 4, "6–8", "2–3 min", "2–3"),
    e("Barbell Overhead Press", 3, "6–10", "2 min", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s", "1–2"),
    e("Dumbbell Lateral Raise", 3, "12–20", "45s", "0–1"),
    e("Barbell Curl", 3, "8–12", "60s", "0–1"),
    e("Rope Pushdown", 3, "10–15", "60s", "0–1"),
  ]},
  lower: { label: "Lower", exercises: [
    e("Back Squat", 4, "5–8", "3 min", "2–3"),
    e("Romanian Deadlift", 3, "8–10", "2 min", "1–2"),
    e("Leg Press", 3, "10–12", "90s", "1–2"),
    e("Seated Leg Curl Machine", 3, "10–15", "60s", "0–2"),
    e("Leg Extension Machine", 3, "12–15", "60s", "0–1"),
    e("Standing Calf Raise Machine", 4, "10–15", "45s", "0–1"),
  ]},
  fullA: { label: "Full Body A", exercises: [
    e("Back Squat", 3, "5–8", "2–3 min", "2–3"),
    e("Flat Barbell Bench Press", 3, "5–8", "2 min", "2–3"),
    e("Barbell Row", 3, "6–10", "2 min", "2"),
    e("Dumbbell Lateral Raise", 2, "12–20", "45s", "0–1"),
    e("Plank", 3, "30–60s", "45s", "—"),
  ]},
  fullB: { label: "Full Body B", exercises: [
    e("Romanian Deadlift", 3, "8–10", "2 min", "1–2"),
    e("Incline Dumbbell Press", 3, "8–12", "90s", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s", "1–2"),
    e("Leg Extension Machine", 2, "12–15", "60s", "0–1"),
    e("Hanging Leg Raise", 3, "10–15", "60s", "0–1"),
  ]},
  fullC: { label: "Full Body C", exercises: [
    e("Leg Press", 3, "10–12", "90s", "1–2"),
    e("Dumbbell Bench Press", 3, "8–12", "90s", "1–2"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s", "1–2"),
    e("Incline Dumbbell Curl", 2, "10–12", "60s", "0–1"),
    e("Standing Calf Raise Machine", 3, "10–15", "45s", "0–1"),
  ]},
  arnoldCB: { label: "Chest & Back", exercises: [
    e("Flat Barbell Bench Press", 4, "6–10", "2 min", "2–3"),
    e("Pull-Up", 4, "6–10", "2 min", "2–3"),
    e("Incline Dumbbell Press", 3, "8–12", "90s", "1–2"),
    e("Barbell Row", 3, "8–10", "2 min", "1–2"),
    e("Cable Crossover (High-to-Low)", 3, "12–15", "60s", "0–1"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s", "0–2"),
  ]},
  arnoldSA: { label: "Shoulders & Arms", exercises: [
    e("Barbell Overhead Press", 4, "6–10", "2 min", "2–3"),
    e("Dumbbell Lateral Raise", 4, "12–20", "45s", "0–1"),
    e("Face Pull", 3, "15–20", "45s", "0–1"),
    e("Barbell Curl", 3, "8–12", "60s", "0–1"),
    e("Overhead Rope Extension", 3, "10–15", "60s", "0–1"),
    e("Hammer Curl", 2, "10–12", "60s", "0–1"),
  ]},
  broChest: { label: "Chest", exercises: [
    e("Flat Barbell Bench Press", 4, "6–10", "2–3 min", "2–3"),
    e("Incline Dumbbell Press", 4, "8–12", "90s", "1–2"),
    e("Chest Dip", 3, "8–12", "90s", "1–2"),
    e("Cable Crossover (High-to-Low)", 3, "12–15", "60s", "0–1"),
    e("Pec Deck Machine", 2, "12–15", "60s", "0–1"),
  ]},
  broBack: { label: "Back", exercises: [
    e("Conventional Deadlift", 3, "4–6", "3 min", "2–3"),
    e("Pull-Up", 4, "6–10", "2 min", "2–3"),
    e("Barbell Row", 4, "8–10", "2 min", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s", "1–2"),
    e("Seated Cable Row (Wide)", 3, "10–12", "90s", "0–2"),
    e("Face Pull", 3, "15–20", "45s", "0–1"),
  ]},
  broShoulders: { label: "Shoulders", exercises: [
    e("Barbell Overhead Press", 4, "6–10", "2 min", "2–3"),
    e("Dumbbell Lateral Raise", 4, "12–20", "45s", "0–1"),
    e("Cable Lateral Raise", 3, "12–20", "45s", "0–1"),
    e("Reverse Pec Deck Machine", 3, "15–20", "45s", "0–1"),
    e("Barbell Shrug", 3, "10–15", "60s", "0–1"),
  ]},
  broArms: { label: "Arms", exercises: [
    e("Barbell Curl", 4, "8–12", "60s", "0–1"),
    e("Rope Pushdown", 4, "10–15", "60s", "0–1"),
    e("Incline Dumbbell Curl", 3, "10–12", "60s", "0–1"),
    e("Overhead Rope Extension", 3, "10–15", "60s", "0–1"),
    e("Hammer Curl", 3, "10–12", "60s", "0–1"),
    e("Bench Dip", 3, "10–15", "60s", "0–1"),
  ]},
  powerUpper: { label: "Power Upper", exercises: [
    e("Flat Barbell Bench Press", 4, "4–6", "3 min", "2–3"),
    e("Barbell Row", 4, "5–6", "3 min", "2–3"),
    e("Barbell Overhead Press", 3, "5–8", "2 min", "2"),
    e("Pull-Up", 3, "6–8", "2 min", "1–2"),
    e("Incline Dumbbell Press", 3, "8–12", "90s", "1–2"),
    e("Barbell Curl", 2, "8–12", "60s", "0–1"),
  ]},
  powerLower: { label: "Power Lower", exercises: [
    e("Back Squat", 4, "4–6", "3 min", "2–3"),
    e("Conventional Deadlift", 3, "3–5", "3–4 min", "2–3"),
    e("Leg Press", 3, "8–10", "2 min", "1–2"),
    e("Seated Leg Curl Machine", 3, "10–12", "60s", "0–2"),
    e("Standing Calf Raise Machine", 4, "10–15", "45s", "0–1"),
  ]},
  strengthSquat: { label: "Squat Focus", exercises: [
    e("Back Squat", 5, "3–5", "3–4 min", "2–3"),
    e("Leg Press", 3, "8–10", "2 min", "1–2"),
    e("Romanian Deadlift", 3, "6–8", "2 min", "1–2"),
    e("Leg Extension Machine", 3, "12–15", "60s", "0–1"),
    e("Standing Calf Raise Machine", 4, "10–15", "45s", "0–1"),
  ]},
  strengthBench: { label: "Bench Focus", exercises: [
    e("Flat Barbell Bench Press", 5, "3–5", "3–4 min", "2–3"),
    e("Barbell Overhead Press", 3, "5–6", "2 min", "2"),
    e("Incline Dumbbell Press", 3, "6–10", "2 min", "1–2"),
    e("Rope Pushdown", 3, "10–15", "60s", "0–1"),
    e("Dumbbell Lateral Raise", 3, "12–20", "45s", "0–1"),
  ]},
  strengthDead: { label: "Deadlift Focus", exercises: [
    e("Conventional Deadlift", 5, "2–4", "4 min", "2–3"),
    e("Barbell Row", 4, "5–6", "2 min", "2"),
    e("Pull-Up", 3, "6–8", "2 min", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "10–12", "90s", "0–2"),
    e("Barbell Curl", 3, "10–12", "60s", "0–1"),
  ]},
  athleticA: { label: "Strength & Power", exercises: [
    e("Back Squat", 4, "3–5", "3 min", "2–3"),
    e("Flat Barbell Bench Press", 4, "4–6", "2 min", "2–3"),
    e("Barbell Row", 3, "6–8", "2 min", "2"),
    e("Walking Lunge", 3, "10–12", "90s", "1–2"),
    e("Hanging Leg Raise", 3, "10–15", "60s", "0–1"),
  ]},
  athleticB: { label: "Explosive & Core", exercises: [
    e("Romanian Deadlift", 4, "5–6", "2 min", "2–3"),
    e("Barbell Overhead Press", 3, "5–8", "2 min", "2"),
    e("Pull-Up", 3, "6–10", "2 min", "1–2"),
    e("Dumbbell Bench Press", 3, "8–10", "90s", "1–2"),
    e("Plank", 3, "30–60s", "45s", "—"),
  ]},

  // Classic 6-day bodybuilding split
  chestTri: { label: "Chest & Triceps", exercises: [
    e("Flat Barbell Bench Press", 4, "6–10", "2–3 min", "2–3"),
    e("Dumbbell Bench Press", 3, "8–12", "90s", "1–2"),
    e("Cable Crossover (High-to-Low)", 3, "12–15", "60s", "0–1"),
    e("Cable Crossover (Low-to-High)", 3, "12–15", "60s", "0–1"),
    e("Rope Pushdown", 3, "12–15", "60s", "0–1"),
    e("Overhead Rope Extension", 3, "10–15", "60s", "0–1"),
  ]},
  backBi: { label: "Back & Biceps", exercises: [
    e("Lat Pulldown (Close Grip)", 4, "8–12", "90s", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "8–12", "90s", "1–2"),
    e("Seated Cable Row (Close)", 3, "8–12", "90s", "1–2"),
    e("Barbell Row", 3, "8–10", "2 min", "1–2"),
    e("Incline Dumbbell Curl", 3, "10–12", "60s", "0–1"),
    e("Hammer Curl", 3, "10–12", "60s", "0–1"),
  ]},
  delts: { label: "Shoulders", exercises: [
    e("Machine Shoulder Press", 4, "8–12", "90s", "1–2"),
    e("Reverse Pec Deck Machine", 3, "15–20", "45s", "0–1"),
    e("Dumbbell Lateral Raise", 4, "12–20", "45s", "0–1"),
    e("Dumbbell Front Raise", 3, "12–15", "45s", "0–1"),
    e("Dumbbell Shrug", 3, "12–15", "60s", "0–1"),
  ]},
  legsD: { label: "Legs", exercises: [
    e("Back Squat", 4, "6–10", "3 min", "2–3"),
    e("Leg Extension Machine", 3, "12–15", "60s", "0–1"),
    e("Seated Leg Curl Machine", 4, "10–15", "60s", "0–2"),
    e("Standing Calf Raise Machine", 4, "12–20", "45s", "0–1"),
  ]},
  armsD: { label: "Arms", exercises: [
    e("Barbell Curl", 4, "8–12", "60s", "0–1"),
    e("Incline Dumbbell Curl", 3, "10–12", "60s", "0–1"),
    e("Hammer Curl", 3, "10–12", "60s", "0–1"),
    e("Rope Pushdown", 4, "10–15", "60s", "0–1"),
    e("Overhead Rope Extension", 3, "10–15", "60s", "0–1"),
  ]},
  chestBack: { label: "Chest & Back", exercises: [
    e("Dumbbell Bench Press", 4, "8–12", "90s", "1–2"),
    e("Lat Pulldown (Wide Grip)", 3, "8–12", "90s", "1–2"),
    e("Cable Crossover (High-to-Low)", 3, "12–15", "60s", "0–1"),
    e("Seated Cable Row (Close)", 3, "8–12", "90s", "1–2"),
    e("Machine Chest Press", 3, "10–12", "90s", "1–2"),
    e("T-Bar Row", 3, "8–12", "2 min", "1–2"),
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
    "Master technique before load — clean reps at ~2–3 RIR drive most early gains.",
    "Build to roughly 10 hard sets per muscle each week, then add sets slowly.",
    "Rest 2–3 min on big lifts; full recovery lets you use heavier, more effective loads.",
    "Consistency beats intensity — three quality sessions a week is the real win.",
  ],
  Intermediate: [
    "Train each muscle ~2× per week and accumulate 12–18 hard sets weekly.",
    "Keep 1–3 reps in reserve on compounds; take isolation to 0–1 RIR.",
    "Beat your logbook: add a rep or a little load on your top sets each week.",
    "Hit compounds first while fresh, then chase volume with machines and cables.",
  ],
  Advanced: [
    "Push toward 15–20+ hard sets per muscle weekly, autoregulating by RIR and bar speed.",
    "Cycle intensity — heavy, low-rep top sets early in the week, higher-rep volume later.",
    "Manage fatigue: when top-set performance drops for 2 sessions, it's time to back off.",
    "Deload every 4–6 weeks (about half the volume) to dissipate fatigue and re-peak.",
  ],
};
const OVERLOAD =
  "Progressive overload drives every result: aim to do a little more than last week — an added rep, a small load increase, or an extra set. Gauge effort with RIR (2 RIR ≈ two reps left in the tank). Once you hit the top of a rep range on all sets at the target RIR, add ~2.5kg and work back up the range. When a lift stalls, add a set or a rep before forcing weight, and take a deload every 4–6 weeks. Log every set so progress is objective, not guessed.";

// ---- Programs ----
const R = "rest";
const P = [
  { id: "six-day-split", name: "6-Day Bodybuilder Split", level: "Intermediate", daysPerWeek: 6, duration: "60–75 min",
    goal: "Muscle Gain", tags: ["Gym"], cover: U("1517344884509-a0c97ec11bcc"),
    description: "A classic high-volume bodybuilding split: Chest & Triceps, Back & Biceps, Shoulders, Legs, Arms, then Chest & Back — big compounds paired with cable and machine detail work.",
    week: ["chestTri", "backBi", "delts", "legsD", "armsD", "chestBack", R] },
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
