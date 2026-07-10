import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    // Base movement this variation belongs to, e.g. "Bench Press", "Squat".
    // Lets us cluster variations together in the UI. Falls back to `name`.
    group: { type: String, trim: true, default: "" },
    muscleGroup: {
      type: String,
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Legs",
        "Glutes",
        "Core",
        "Cardio",
        "Full Body",
        "Other",
      ],
      default: "Other",
    },
    // Free-form supporting muscles ("Front Delts", "Forearms", "Core"…).
    secondaryMuscles: { type: [String], default: [] },
    equipment: {
      type: String,
      enum: [
        "Barbell",
        "Dumbbell",
        "Machine",
        "Cable",
        "Bodyweight",
        "Kettlebell",
        "Band",
        "Other",
      ],
      default: "Other",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    icon: { type: String, default: "🏋️" }, // small illustration (emoji)
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Default a variation's group to its own name so ungrouped/custom moves still
// behave sensibly everywhere we cluster by `group`.
exerciseSchema.pre("save", function (next) {
  if (!this.group) this.group = this.name;
  next();
});

export default mongoose.model("Exercise", exerciseSchema);
