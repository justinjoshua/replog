# ⚡ RepLog — AI Workout Logger

A full-stack **MERN** gym workout logger with **Google Gemini** AI features and a
premium dark UI. Log your training, track PRs and volume over time, and let AI
structure your workouts and coach your progress.

![Stack](https://img.shields.io/badge/Stack-MERN-2ea44f)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-f5c518?logo=google&logoColor=black)

## Features

**Core**
- 📊 **Dashboard** — total/weekly workouts, training streak, volume, and a 30-day
  volume chart (Recharts) plus a personal-records table (estimated 1RM via Epley).
- ➕ **Log workouts** — build sessions with exercises and sets (reps × weight),
  per-exercise **rest timer** and notes, autocomplete, and one-tap quick-add from
  your favorites and recently-used lists.
- 📋 **History** — expandable list of every session with per-exercise breakdowns.
- 🏋️ **Exercise library** — 100+ movements organized by **base movement and its
  variations** (e.g. Bench Press → flat/incline/decline/dumbbell/close-grip…).
  Browse as premium cards: switch or **randomize** a variation, filter by muscle
  or equipment, search, favorite, and send straight to the logger.

**Design**
- 🎨 Modern dark-first UI (STNDRD-inspired gold-on-black): rounded cards with soft
  shadows and hover-lift, gradient accents, difficulty/equipment badges, muscle
  tags, loading **skeletons**, empty states, page transitions and toast animations.
  Fully responsive down to mobile.

**AI (Google Gemini)**
- ✨ **Natural-language logging** — type *"3×8 bench at 60kg, then 4×10 rows at 40"*
  and Gemini structures it into exercises and sets.
- 🏗️ **Workout generator** — describe your goal, equipment, time and focus; get a
  full session you can save with one click.
- 📈 **Progress coach** — Gemini analyzes your recent training for trends, plateaus
  and imbalances, and suggests what to do next.

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 (Vite), React Router, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| AI | Google Gemini (`@google/genai`) |

## Quick start

Runs out of the box — **no database setup or API key required**. It starts a
local on-disk MongoDB automatically (your data persists across restarts) and
simply disables AI until you add a Gemini key.

```bash
# 1. Backend
cd server
npm install
npm start            # http://localhost:4000

# 2. Frontend (in a second terminal)
cd client
npm install
npm run dev          # http://localhost:5173
```

Open **http://localhost:5173**.

## Configuration

Copy `server/.env.example` to `server/.env` and fill in what you need:

| Var | Purpose |
|-----|---------|
| `MONGO_URI` | MongoDB connection string. **Unset →** a local on-disk MongoDB under `server/.data` that **persists across restarts** (zero setup, no account). Set a [MongoDB Atlas](https://www.mongodb.com/atlas) string to use a cloud database instead. |
| `GEMINI_API_KEY` | Google Gemini key ([get one free](https://aistudio.google.com/apikey)). **Unset →** app works, AI features disabled. |
| `GEMINI_MODEL` | Gemini model id (default `gemini-2.5-flash`). |
| `PORT` | Backend port (default `4000`). |

## API

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/health` | Health check |
| `GET/POST/DELETE` | `/api/exercises` | Exercise library CRUD (filter `?muscle=&equipment=&q=`) |
| `GET` | `/api/exercises/groups` | Variations clustered by base movement |
| `GET/POST/PUT/DELETE` | `/api/workouts` | Workout CRUD |
| `GET` | `/api/stats/summary` | Dashboard headline numbers |
| `GET` | `/api/stats/volume?days=30` | Daily volume series |
| `GET` | `/api/stats/prs` | Best estimated 1RM per exercise |
| `GET` | `/api/stats/exercise/:name` | Progression for one lift |
| `POST` | `/api/ai/parse` | Free-text → structured workout |
| `POST` | `/api/ai/generate` | Goals → generated workout |
| `POST` | `/api/ai/coach` | Analyze recent training → report |

## Project layout

```
ai-workout-logger/
  server/               Express + MongoDB API
    src/
      models/           Exercise, Workout (Mongoose schemas)
      routes/           exercises, workouts, stats, ai
      services/gemini.js  Gemini wrapper (parse / generate / coach)
      db.js             Mongo connection (Atlas or in-memory fallback)
      seed.js           starter exercise library
      index.js          app entry
  client/               React (Vite) frontend
    src/
      pages/            Dashboard, LogWorkout, History, Exercises, Coach
      components/       ExerciseCard, RestTimer, Skeleton (reusable UI)
      hooks/            useLocalStorage (favorites, recently-used)
      lib/              exerciseMeta (icons, muscle/equipment metadata)
      api.js            fetch wrapper
      App.jsx           layout + routing
```

## License

MIT
