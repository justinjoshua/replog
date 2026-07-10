import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, default: 0, min: 0 },
    weight: { type: Number, default: 0, min: 0 }, // in kg
    rpe: { type: Number, min: 1, max: 10 }, // rate of perceived exertion (optional)
    completed: { type: Boolean, default: true },
  },
  { _id: false }
);

const entrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    muscleGroup: { type: String, default: "Other" },
    equipment: { type: String, default: "" }, // the machine/equipment used
    notes: { type: String, default: "" },
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, default: "Workout" },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    durationMin: { type: Number, min: 0 },
    exercises: { type: [entrySchema], default: [] },
  },
  { timestamps: true }
);

// Total volume = sum over every set of reps * weight. Handy for progress charts.
workoutSchema.virtual("volume").get(function () {
  return this.exercises.reduce(
    (t, ex) => t + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );
});

workoutSchema.set("toJSON", { virtuals: true });
workoutSchema.set("toObject", { virtuals: true });

export default mongoose.model("Workout", workoutSchema);
