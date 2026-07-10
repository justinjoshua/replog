// Queue a program day's exercises into the logger (via the existing
// localStorage 'replog.pending' bridge that LogWorkout drains on mount).

function parseReps(reps) {
  if (typeof reps === "number") return reps;
  const m = String(reps).match(/(\d+)\s*[–-]\s*(\d+)/); // "8–12" -> 12
  if (m) return Number(m[2]);
  const n = String(reps).match(/\d+/); // "10" -> 10; "45s" -> 45 (fine as a target)
  return n ? Number(n[0]) : 8;
}

export function queueProgramDay(exercises, byName) {
  const pending = exercises.map((x) => {
    const lib = byName[x.name];
    return {
      name: x.name,
      muscleGroup: lib?.muscleGroup || "Other",
      equipment: lib?.equipment || "",
      setCount: x.sets || 3,
      reps: parseReps(x.reps),
    };
  });
  localStorage.setItem("replog.pending", JSON.stringify(pending));
}
