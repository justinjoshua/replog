# 💪 RepLog — AI Workout Logger & Program Hub

A full-stack **MERN** fitness app that doesn't just track your training — it helps
you **discover and follow complete programs**, **demonstrates every exercise**, and
uses **Google Gemini** to log, generate and coach your workouts. Built as a
portfolio piece with a premium, themeable, mobile-first dark UI.

![Stack](https://img.shields.io/badge/Stack-MERN-4c1d95)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8b5cf6?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Accounts
- **🔐 Auth** — email/password sign-up & login (JWT + bcrypt). Every user's workouts,
  stats and AI coaching are **private and scoped to their account**.

### Train
- **📋 Built-in programs** — 12 professionally-structured splits across Beginner →
  Advanced (Full Body, Upper/Lower, PPL 3-/6-day, Arnold, Bro Split, Powerbuilding,
  Strength Focus, Athletic…). Each has a weekly schedule, day-by-day exercises with
  **sets / reps / rest**, warm-up, cool-down, tips and progressive-overload guidance.
  **Explore Programs** with filters (level · goal · gym/home), then **Start Program**
  to drop a day straight into the logger.
- **➕ Log workouts** — build sessions with sets (reps × weight), per-exercise **rest
  timer** & notes, autocomplete, and one-tap quick-add from **favorites / recently-used**.
- **📅 Workout-day builder & custom splits** — pick a day (Push, Pull, Legs, Chest…)
  or save your own split, then **auto-build** it (offline) or **AI-build** it (Gemini).
- **📈 Dashboard** — greeting, weekly-goal **progress ring**, streak, volume &
  estimated-calorie stats, a 30-day volume chart, recent workouts and PRs (Epley 1RM).
- **🗒️ History** — every session, expandable, with per-exercise breakdowns.

### Exercise library (155 movements)
- Organized by **base movement and its variations** (Bench Press → flat / incline /
  decline / dumbbell / close-grip / machine…), each with target + secondary muscles,
  difficulty and equipment.
- **Switch or randomize** a variation, filter by muscle/equipment, search, favorite.
- **View Exercise panel** — a right slide-out (desktop) / bottom sheet (mobile) with
  an **animated demonstration**, step-by-step instructions, muscle map, recommended
  sets/reps, and **AI-generated form tips & common mistakes**.

### AI (Google Gemini)
- **Natural-language logging** — *"3×8 bench at 60kg, then 4×10 rows at 40"* → structured sets.
- **Workout generator** — goal / equipment / time / focus → a full session to save.
- **Progress coach** — analyzes recent training for trends, plateaus and imbalances.
- **Per-exercise form guide** — tips, mistakes and a set/rep recommendation on demand.

### Design
- Minimal, premium, **mobile-first** dark UI with a **live theme switcher**: 9 solid
  accents **plus 6 shiny metallic themes** (Silver, Gold, Rose Gold, Copper, Gunmetal,
  Onyx) with reflective hover effects — all from a single CSS variable.
- Bottom-tab navigation on phones, side nav on desktop. Rounded cards, soft shadows,
  loading skeletons, empty states, page/toast animations, outlined [Lucide](https://lucide.dev) icons.

---

## 🖼️ A note on exercise images

Out of the box the app shows **open-license** exercise imagery (public-domain photos
from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) via CDN, plus
built-in SVG movement illustrations) — no setup needed.

The higher-fidelity **animated GIF demos** are sourced from **ExerciseDB (RapidAPI)**,
whose license does not permit redistribution, so those media files are **not committed
to this repo**. Add a `RAPIDAPI_KEY` to enable syncing them locally; without it the app
falls back gracefully to the open-license imagery above.

---

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 (Vite), React Router, Recharts, Lucide |
| Backend | Node.js, Express (ESM) |
| Database | MongoDB + Mongoose (local on-disk fallback or Atlas) |
| AI | Google Gemini (`@google/genai`) |

---

## 🚀 Quick start

Runs out of the box — **no database setup or API key required**. It starts a local
on-disk MongoDB automatically (data persists across restarts) and simply disables AI
until you add a Gemini key.

```bash
# 1. Backend
cd server
npm install
npm start            # http://localhost:4000

# 2. Frontend (second terminal)
cd client
npm install
npm run dev          # http://localhost:5173
```

Open **http://localhost:5173**.

---

## ⚙️ Configuration

Copy `server/.env.example` → `server/.env` and set what you need:

| Var | Purpose |
|-----|---------|
| `MONGO_URI` | MongoDB connection string. **Unset →** local on-disk MongoDB under `server/.data` (persists, zero setup). Set a [MongoDB Atlas](https://www.mongodb.com/atlas) string for the cloud. |
| `GEMINI_API_KEY` | Google Gemini key ([free](https://aistudio.google.com/apikey)). **Unset →** app works, AI features disabled. |
| `GEMINI_MODEL` | Gemini model id (default `gemini-2.5-flash`). |
| `RAPIDAPI_KEY` | *Optional* — [ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) key, only for locally syncing exercise GIFs. Not needed at runtime. |
| `PORT` | Backend port (default `4000`). |

> `.env` is gitignored — never commit your keys.

---

## 🔌 API

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` · `/login` | Create account / sign in → JWT |
| `GET` | `/api/auth/me` | Current user (from Bearer token) |
| `GET/POST/DELETE` | `/api/exercises` | Exercise library (filter `?muscle=&equipment=&q=`) |
| `GET` | `/api/exercises/groups` | Variations clustered by base movement |
| `GET/POST/PUT/DELETE` | `/api/workouts` | Workout CRUD |
| `GET` | `/api/stats/summary` · `/volume` · `/prs` · `/exercise/:name` | Dashboard stats |
| `POST` | `/api/ai/parse` | Free-text → structured workout |
| `POST` | `/api/ai/generate` | Goals → generated workout |
| `POST` | `/api/ai/coach` | Analyze recent training → report |
| `POST` | `/api/ai/exercise-guide` | Form tips + mistakes for one exercise |

---

## 🗂️ Project layout

```
replog/
  server/                      Express + MongoDB API
    src/
      models/                  Exercise, Workout (Mongoose)
      routes/                  exercises, workouts, stats, ai
      services/gemini.js       Gemini wrapper (parse / generate / coach / guide)
      db.js  seed.js  index.js
  client/                      React (Vite) frontend
    src/
      pages/                   Dashboard, Programs, ProgramDetail, LogWorkout,
                               History, Exercises, Coach
      components/              ExerciseCard, ExerciseViewer, ProgramCard, CoverImage,
                               Icon, Logo, ProgressRing, ThemePicker, RestTimer, ...
      hooks/                   useLocalStorage, useTheme
      lib/                     programs, exerciseImages/Gifs/Info, dayTemplates, images
      App.jsx                  layout, routing, providers
```

---

## 📄 License

[MIT](LICENSE) © Justin Joshua
