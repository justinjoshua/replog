// Shared presentation metadata for exercises — one source of truth so cards,
// tags and filters stay visually consistent across every page.

export const MUSCLES = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Glutes", "Core", "Cardio", "Full Body", "Other",
];

export const EQUIPMENT = [
  "Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Band", "Other",
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// Emoji per muscle group — a lightweight "illustration" without asset files.
export const MUSCLE_ICON = {
  Chest: "🏋️",
  Back: "🚣",
  Shoulders: "🛡️",
  Biceps: "💪",
  Triceps: "🔺",
  Legs: "🦵",
  Glutes: "🍑",
  Core: "🔥",
  Cardio: "🏃",
  "Full Body": "⚡",
  Other: "🏋️",
};

export const EQUIP_ICON = {
  Barbell: "🏋️",
  Dumbbell: "🏋️",
  Machine: "⚙️",
  Cable: "🔗",
  Bodyweight: "🧍",
  Kettlebell: "🔔",
  Band: "🪢",
  Other: "🎽",
};

export const difficultyClass = (d) => `badge ${(d || "Intermediate").toLowerCase()}`;

export const iconFor = (ex) =>
  ex?.icon || MUSCLE_ICON[ex?.muscleGroup] || "🏋️";
