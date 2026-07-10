// Tiny fetch wrapper for the backend JSON API.
async function req(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // exercises
  listExercises: (params = "") => req(`/exercises${params}`),
  exerciseGroups: (params = "") => req(`/exercises/groups${params}`),
  createExercise: (body) => req("/exercises", { method: "POST", body: JSON.stringify(body) }),
  deleteExercise: (id) => req(`/exercises/${id}`, { method: "DELETE" }),

  // workouts
  listWorkouts: (limit = 100) => req(`/workouts?limit=${limit}`),
  getWorkout: (id) => req(`/workouts/${id}`),
  createWorkout: (body) => req("/workouts", { method: "POST", body: JSON.stringify(body) }),
  updateWorkout: (id, body) => req(`/workouts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteWorkout: (id) => req(`/workouts/${id}`, { method: "DELETE" }),

  // stats
  summary: () => req("/stats/summary"),
  volume: (days = 30) => req(`/stats/volume?days=${days}`),
  prs: () => req("/stats/prs"),
  exerciseProgress: (name) => req(`/stats/exercise/${encodeURIComponent(name)}`),

  // ai
  aiStatus: () => req("/ai/status"),
  aiParse: (text) => req("/ai/parse", { method: "POST", body: JSON.stringify({ text }) }),
  aiGenerate: (body) => req("/ai/generate", { method: "POST", body: JSON.stringify(body) }),
  aiCoach: () => req("/ai/coach", { method: "POST", body: JSON.stringify({}) }),
  aiExerciseGuide: (body) => req("/ai/exercise-guide", { method: "POST", body: JSON.stringify(body) }),
};
