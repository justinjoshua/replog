import Exercise from "./models/Exercise.js";

/**
 * A rich, variation-first exercise library.
 *
 * Every movement is described once as a `group` (base movement) plus its
 * variations. A variation is `[name, equipment, difficulty, secondaryOverride?]`.
 * We expand these into flat Exercise docs at seed time. Grouping lets the UI
 * offer "view / select / randomize / switch variation" per movement.
 */
const GROUPS = [
  // ---------------- CHEST ----------------
  {
    group: "Bench Press",
    muscleGroup: "Chest",
    secondary: ["Front Delts", "Triceps"],
    icon: "🏋️",
    variations: [
      ["Flat Barbell Bench Press", "Barbell", "Intermediate"],
      ["Incline Barbell Bench Press", "Barbell", "Intermediate"],
      ["Decline Barbell Bench Press", "Barbell", "Intermediate"],
      ["Dumbbell Bench Press", "Dumbbell", "Beginner"],
      ["Incline Dumbbell Press", "Dumbbell", "Beginner"],
      ["Decline Dumbbell Press", "Dumbbell", "Beginner"],
      ["Smith Machine Bench Press", "Machine", "Beginner"],
      ["Smith Machine Incline Press", "Machine", "Beginner"],
      ["Machine Chest Press", "Machine", "Beginner"],
      ["Hammer Strength Chest Press", "Machine", "Beginner"],
      ["Incline Machine Press", "Machine", "Beginner"],
      ["Cable Chest Press", "Cable", "Beginner"],
      ["Close-Grip Bench Press", "Barbell", "Intermediate", ["Triceps"]],
    ],
  },
  {
    group: "Chest Fly",
    muscleGroup: "Chest",
    secondary: ["Front Delts"],
    icon: "🦋",
    variations: [
      ["Pec Deck Machine", "Machine", "Beginner"],
      ["Cable Fly", "Cable", "Beginner"],
      ["Cable Crossover (High-to-Low)", "Cable", "Intermediate"],
      ["Cable Crossover (Low-to-High)", "Cable", "Intermediate"],
      ["Incline Cable Fly", "Cable", "Intermediate"],
      ["Dumbbell Fly", "Dumbbell", "Beginner"],
      ["Incline Dumbbell Fly", "Dumbbell", "Beginner"],
    ],
  },
  {
    group: "Chest Dip",
    muscleGroup: "Chest",
    secondary: ["Triceps", "Front Delts"],
    icon: "🔻",
    variations: [
      ["Chest Dip", "Bodyweight", "Intermediate"],
      ["Assisted Dip Machine", "Machine", "Beginner"],
      ["Weighted Chest Dip", "Bodyweight", "Advanced"],
    ],
  },
  {
    group: "Push-Up",
    muscleGroup: "Chest",
    secondary: ["Triceps", "Core"],
    icon: "🤸",
    variations: [
      ["Standard Push-Up", "Bodyweight", "Beginner"],
      ["Incline Push-Up", "Bodyweight", "Beginner"],
      ["Decline Push-Up", "Bodyweight", "Intermediate"],
      ["Diamond Push-Up", "Bodyweight", "Intermediate", ["Triceps"]],
      ["Weighted Push-Up", "Bodyweight", "Advanced"],
    ],
  },

  // ---------------- BACK ----------------
  {
    group: "Vertical Pull",
    muscleGroup: "Back",
    secondary: ["Biceps", "Rear Delts"],
    icon: "🧗",
    variations: [
      ["Lat Pulldown (Wide Grip)", "Cable", "Beginner"],
      ["Lat Pulldown (Close Grip)", "Cable", "Beginner"],
      ["Neutral-Grip Lat Pulldown", "Cable", "Beginner"],
      ["Machine Lat Pulldown", "Machine", "Beginner"],
      ["Hammer Strength Pulldown", "Machine", "Beginner"],
      ["Assisted Pull-Up Machine", "Machine", "Beginner"],
      ["Pull-Up", "Bodyweight", "Advanced"],
      ["Chin-Up", "Bodyweight", "Intermediate", ["Biceps"]],
      ["Straight-Arm Pulldown", "Cable", "Beginner", ["Lats"]],
    ],
  },
  {
    group: "Row",
    muscleGroup: "Back",
    secondary: ["Biceps", "Rear Delts", "Lower Back"],
    icon: "🚣",
    variations: [
      ["Barbell Row", "Barbell", "Intermediate"],
      ["Pendlay Row", "Barbell", "Advanced"],
      ["T-Bar Row", "Barbell", "Intermediate"],
      ["Seated Cable Row (Wide)", "Cable", "Beginner"],
      ["Seated Cable Row (Close)", "Cable", "Beginner"],
      ["Chest-Supported Row Machine", "Machine", "Beginner"],
      ["Hammer Strength Row", "Machine", "Beginner"],
      ["Seated Machine Row", "Machine", "Beginner"],
      ["Single-Arm Dumbbell Row", "Dumbbell", "Beginner"],
      ["Smith Machine Row", "Machine", "Beginner"],
    ],
  },
  {
    group: "Deadlift",
    muscleGroup: "Back",
    secondary: ["Glutes", "Hamstrings", "Lower Back", "Forearms"],
    icon: "⚡",
    variations: [
      ["Conventional Deadlift", "Barbell", "Advanced"],
      ["Sumo Deadlift", "Barbell", "Advanced"],
      ["Trap Bar Deadlift", "Barbell", "Intermediate"],
      ["Deficit Deadlift", "Barbell", "Advanced"],
      ["Rack Pull", "Barbell", "Intermediate"],
      ["Smith Machine Deadlift", "Machine", "Beginner"],
    ],
  },
  {
    group: "Shrug",
    muscleGroup: "Back",
    secondary: ["Traps"],
    icon: "🤷",
    variations: [
      ["Barbell Shrug", "Barbell", "Beginner"],
      ["Dumbbell Shrug", "Dumbbell", "Beginner"],
      ["Machine Shrug", "Machine", "Beginner"],
      ["Cable Shrug", "Cable", "Beginner"],
      ["Smith Machine Shrug", "Machine", "Beginner"],
    ],
  },
  {
    group: "Back Extension",
    muscleGroup: "Back",
    secondary: ["Glutes", "Hamstrings", "Lower Back"],
    icon: "🌙",
    variations: [
      ["45° Back Extension", "Bodyweight", "Beginner"],
      ["Machine Back Extension", "Machine", "Beginner"],
      ["Weighted Hyperextension", "Bodyweight", "Intermediate"],
    ],
  },

  // ---------------- SHOULDERS ----------------
  {
    group: "Overhead Press",
    muscleGroup: "Shoulders",
    secondary: ["Triceps", "Upper Chest"],
    icon: "🛡️",
    variations: [
      ["Barbell Overhead Press", "Barbell", "Intermediate"],
      ["Seated Barbell Press", "Barbell", "Intermediate"],
      ["Dumbbell Shoulder Press", "Dumbbell", "Beginner"],
      ["Arnold Press", "Dumbbell", "Intermediate"],
      ["Machine Shoulder Press", "Machine", "Beginner"],
      ["Smith Machine Shoulder Press", "Machine", "Beginner"],
      ["Push Press", "Barbell", "Advanced", ["Triceps", "Legs"]],
    ],
  },
  {
    group: "Lateral Raise",
    muscleGroup: "Shoulders",
    secondary: ["Traps"],
    icon: "🕊️",
    variations: [
      ["Dumbbell Lateral Raise", "Dumbbell", "Beginner"],
      ["Cable Lateral Raise", "Cable", "Intermediate"],
      ["Machine Lateral Raise", "Machine", "Beginner"],
      ["Leaning Cable Lateral Raise", "Cable", "Intermediate"],
    ],
  },
  {
    group: "Rear Delt",
    muscleGroup: "Shoulders",
    secondary: ["Upper Back"],
    icon: "🎯",
    variations: [
      ["Reverse Pec Deck Machine", "Machine", "Beginner"],
      ["Bent-Over Reverse Fly", "Dumbbell", "Beginner"],
      ["Face Pull", "Cable", "Beginner"],
      ["Cable Rear Delt Fly", "Cable", "Intermediate"],
    ],
  },
  {
    group: "Upright Row",
    muscleGroup: "Shoulders",
    secondary: ["Traps"],
    icon: "🔼",
    variations: [
      ["Barbell Upright Row", "Barbell", "Intermediate"],
      ["Cable Upright Row", "Cable", "Beginner"],
      ["Dumbbell Upright Row", "Dumbbell", "Beginner"],
      ["Smith Machine Upright Row", "Machine", "Beginner"],
    ],
  },

  // ---------------- BICEPS ----------------
  {
    group: "Biceps Curl",
    muscleGroup: "Biceps",
    secondary: ["Forearms"],
    icon: "💪",
    variations: [
      ["Barbell Curl", "Barbell", "Beginner"],
      ["EZ-Bar Curl", "Barbell", "Beginner"],
      ["Incline Dumbbell Curl", "Dumbbell", "Intermediate"],
      ["Hammer Curl", "Dumbbell", "Beginner", ["Forearms", "Brachialis"]],
      ["Concentration Curl", "Dumbbell", "Beginner"],
      ["Spider Curl", "Dumbbell", "Intermediate"],
      ["Cable Curl", "Cable", "Beginner"],
      ["Cable Rope Hammer Curl", "Cable", "Beginner", ["Forearms"]],
      ["Bayesian Cable Curl", "Cable", "Intermediate"],
      ["Machine Preacher Curl", "Machine", "Beginner"],
      ["Preacher Curl (EZ-Bar)", "Barbell", "Intermediate"],
    ],
  },

  // ---------------- TRICEPS ----------------
  {
    group: "Triceps Extension",
    muscleGroup: "Triceps",
    secondary: [],
    icon: "🔺",
    variations: [
      ["Rope Pushdown", "Cable", "Beginner"],
      ["Straight-Bar Pushdown", "Cable", "Beginner"],
      ["V-Bar Pushdown", "Cable", "Beginner"],
      ["Overhead Rope Extension", "Cable", "Intermediate"],
      ["Single-Arm Cable Kickback", "Cable", "Beginner"],
      ["Skull Crushers", "Barbell", "Intermediate"],
      ["Dumbbell Overhead Extension", "Dumbbell", "Beginner"],
      ["Triceps Dip Machine", "Machine", "Beginner"],
      ["Bench Dip", "Bodyweight", "Beginner"],
      ["Close-Grip Bench Press", "Barbell", "Intermediate", ["Chest"]],
    ],
  },

  // ---------------- LEGS ----------------
  {
    group: "Squat",
    muscleGroup: "Legs",
    secondary: ["Glutes", "Hamstrings", "Core"],
    icon: "🦵",
    variations: [
      ["Back Squat", "Barbell", "Advanced"],
      ["Front Squat", "Barbell", "Advanced"],
      ["Goblet Squat", "Dumbbell", "Beginner"],
      ["Bulgarian Split Squat", "Dumbbell", "Intermediate", ["Glutes"]],
      ["Smith Machine Squat", "Machine", "Beginner"],
      ["Hack Squat Machine", "Machine", "Intermediate"],
      ["Pendulum Squat Machine", "Machine", "Intermediate"],
      ["Leg Press", "Machine", "Beginner"],
      ["Single-Leg Press", "Machine", "Intermediate"],
    ],
  },
  {
    group: "Hip Hinge",
    muscleGroup: "Legs",
    secondary: ["Glutes", "Lower Back", "Hamstrings"],
    icon: "🌉",
    variations: [
      ["Romanian Deadlift", "Barbell", "Intermediate"],
      ["Dumbbell RDL", "Dumbbell", "Beginner"],
      ["Good Morning", "Barbell", "Advanced"],
      ["Seated Leg Curl Machine", "Machine", "Beginner", ["Hamstrings"]],
      ["Lying Leg Curl Machine", "Machine", "Beginner", ["Hamstrings"]],
      ["Nordic Hamstring Curl", "Bodyweight", "Advanced", ["Hamstrings"]],
    ],
  },
  {
    group: "Lunge",
    muscleGroup: "Legs",
    secondary: ["Glutes", "Hamstrings"],
    icon: "🚶",
    variations: [
      ["Walking Lunge", "Dumbbell", "Intermediate"],
      ["Reverse Lunge", "Dumbbell", "Beginner"],
      ["Step-Up", "Dumbbell", "Beginner"],
      ["Smith Machine Lunge", "Machine", "Beginner"],
      ["Curtsy Lunge", "Dumbbell", "Intermediate", ["Glutes"]],
    ],
  },
  {
    group: "Quad Isolation",
    muscleGroup: "Legs",
    secondary: [],
    icon: "🦿",
    variations: [
      ["Leg Extension Machine", "Machine", "Beginner"],
      ["Single-Leg Extension", "Machine", "Beginner"],
      ["Sissy Squat", "Bodyweight", "Advanced"],
    ],
  },
  {
    group: "Hip Adduction / Abduction",
    muscleGroup: "Legs",
    secondary: ["Glutes"],
    icon: "↔️",
    variations: [
      ["Hip Adduction Machine", "Machine", "Beginner"],
      ["Hip Abduction Machine", "Machine", "Beginner", ["Glutes"]],
      ["Cable Hip Abduction", "Cable", "Beginner", ["Glutes"]],
    ],
  },
  {
    group: "Calf Raise",
    muscleGroup: "Legs",
    secondary: [],
    icon: "🐐",
    variations: [
      ["Standing Calf Raise Machine", "Machine", "Beginner"],
      ["Seated Calf Raise Machine", "Machine", "Beginner"],
      ["Smith Machine Calf Raise", "Machine", "Beginner"],
      ["Leg Press Calf Raise", "Machine", "Beginner"],
    ],
  },

  // ---------------- GLUTES ----------------
  {
    group: "Hip Thrust",
    muscleGroup: "Glutes",
    secondary: ["Hamstrings"],
    icon: "🍑",
    variations: [
      ["Barbell Hip Thrust", "Barbell", "Intermediate"],
      ["Machine Hip Thrust", "Machine", "Beginner"],
      ["Smith Machine Hip Thrust", "Machine", "Beginner"],
      ["Single-Leg Hip Thrust", "Bodyweight", "Intermediate"],
      ["Glute Bridge", "Bodyweight", "Beginner"],
      ["Cable Glute Kickback", "Cable", "Beginner"],
      ["Cable Pull-Through", "Cable", "Beginner"],
    ],
  },

  // ---------------- CORE ----------------
  {
    group: "Core",
    muscleGroup: "Core",
    secondary: [],
    icon: "🔥",
    variations: [
      ["Plank", "Bodyweight", "Beginner"],
      ["Hanging Leg Raise", "Bodyweight", "Advanced"],
      ["Captain's Chair Leg Raise", "Machine", "Intermediate"],
      ["Cable Crunch", "Cable", "Beginner"],
      ["Machine Ab Crunch", "Machine", "Beginner"],
      ["Russian Twist", "Bodyweight", "Beginner", ["Obliques"]],
      ["Ab Wheel Rollout", "Bodyweight", "Advanced"],
      ["Bicycle Crunch", "Bodyweight", "Beginner", ["Obliques"]],
      ["Decline Sit-Up", "Bodyweight", "Intermediate"],
    ],
  },

  // ---------------- CARDIO ----------------
  {
    group: "Cardio",
    muscleGroup: "Cardio",
    secondary: ["Full Body"],
    icon: "🏃",
    variations: [
      ["Treadmill Run", "Machine", "Beginner"],
      ["Incline Treadmill Walk", "Machine", "Beginner"],
      ["Rowing Machine (Erg)", "Machine", "Intermediate"],
      ["Stationary Bike", "Machine", "Beginner"],
      ["Assault Bike", "Machine", "Advanced"],
      ["Stair Climber", "Machine", "Intermediate"],
      ["Elliptical Trainer", "Machine", "Beginner"],
      ["Jump Rope", "Bodyweight", "Beginner"],
    ],
  },
];

// Flatten groups → individual Exercise documents.
function buildLibrary() {
  const docs = [];
  for (const g of GROUPS) {
    for (const [name, equipment, difficulty, secondaryOverride] of g.variations) {
      docs.push({
        name,
        group: g.group,
        muscleGroup: g.muscleGroup,
        secondaryMuscles: secondaryOverride ?? g.secondary,
        equipment,
        difficulty,
        icon: g.icon,
      });
    }
  }
  return docs;
}

export async function seedExercises() {
  const library = buildLibrary();
  const names = library.map((d) => d.name);

  // Self-healing & idempotent: prune stale seed entries (removed/renamed as the
  // catalog evolves) but never touch user-created customs, then add anything
  // missing. Keeps the library clean without wiping workouts.
  const pruned = await Exercise.deleteMany({
    isCustom: { $ne: true },
    name: { $nin: names },
  });
  if (pruned.deletedCount) console.log(`[seed] pruned ${pruned.deletedCount} outdated exercises`);

  const existing = new Set((await Exercise.find({}, "name")).map((e) => e.name));
  const missing = library.filter((d) => !existing.has(d.name));
  if (missing.length) {
    await Exercise.insertMany(missing);
    console.log(`[seed] added ${missing.length} exercises`);
  }

  const total = await Exercise.estimatedDocumentCount();
  console.log(`[seed] library ready — ${total} exercises across ${GROUPS.length} movements`);
}
