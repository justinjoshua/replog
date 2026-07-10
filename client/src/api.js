const TOKEN_KEY = "replog.token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

// Tiny fetch wrapper for the backend JSON API. Attaches the auth token and, on
// a 401, clears it and notifies the app to return to the login screen.
async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event("replog:unauthorized"));
  }
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
  // auth
  register: (body) => req("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => req("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => req("/auth/me"),

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
