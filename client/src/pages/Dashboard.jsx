import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api.js";
import Icon from "../components/Icon.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import ProgramCard from "../components/ProgramCard.jsx";
import { LineSkeleton } from "../components/Skeleton.jsx";
import { HERO_IMG } from "../lib/images.js";
import { PROGRAMS, getProgram } from "../lib/programs.js";
import { queueProgramDay } from "../lib/startProgram.js";
import { useToast } from "../toast.jsx";

const WEEKLY_GOAL = 5; // target sessions per week

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [summary, setSummary] = useState(null);
  const [volume, setVolume] = useState([]);
  const [prs, setPrs] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [byName, setByName] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.summary(), api.volume(30), api.prs(), api.listWorkouts(50)])
      .then(([s, v, p, w]) => {
        setSummary(s);
        setVolume(v);
        setPrs(p);
        setWorkouts(w);
      })
      .finally(() => setLoading(false));
    api.listExercises()
      .then((list) => setByName(Object.fromEntries(list.map((e) => [e.name, e]))))
      .catch(() => {});
  }, []);

  const startProgram = (p) => {
    const prog = getProgram(p.id);
    queueProgramDay(prog.dayDefs[0].exercises, byName);
    toast(`Starting ${p.name} — ${prog.dayDefs[0].label} loaded`);
    navigate("/log");
  };

  const greeting = greet();

  if (loading)
    return (
      <>
        <div className="page-head">
          <h1>{greeting}</h1>
          <p>Loading your training…</p>
        </div>
        <div className="skeleton" style={{ height: 150, borderRadius: "var(--radius)", marginBottom: 16 }} />
        <div className="grid cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="skeleton" key={i} style={{ height: 108 }} />
          ))}
        </div>
      </>
    );

  const hasData = summary?.totalWorkouts > 0;

  // Weekly rollups computed client-side from the last 7 days of workouts.
  const weekAgo = Date.now() - 7 * 864e5;
  const thisWeek = workouts.filter((w) => new Date(w.date).getTime() >= weekAgo);
  const weekMinutes = thisWeek.reduce((t, w) => t + (w.durationMin || 0), 0);
  const weekCalories = thisWeek.reduce(
    (t, w) => t + estCalories(w),
    0
  );
  const recent = workouts.slice(0, 5);

  return (
    <>
      {/* STNDRD-style photo hero */}
      <div className="hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
        <div className="hero-inner">
          <div className="eyebrow">{greeting} — no days off</div>
          <h1>Time to<br />train.</h1>
          <p className="hero-sub">
            {hasData
              ? `${summary.streak}-day streak · ${summary.workoutsThisWeek} session${summary.workoutsThisWeek === 1 ? "" : "s"} this week`
              : "Log your first session to start tracking your progress."}
          </p>
          <Link to="/log" className="btn primary"><Icon name="play" size={18} /> Quick start</Link>
        </div>
      </div>

      {/* Explore Programs */}
      <div className="section-head">
        <h2>Explore programs</h2>
        <Link to="/programs" className="btn ghost sm">View all <Icon name="chevronRight" size={15} /></Link>
      </div>
      <div className="prog-rail">
        {PROGRAMS.slice(0, 6).map((p) => (
          <ProgramCard key={p.id} program={p} onStart={startProgram} compact />
        ))}
      </div>

      {!hasData ? (
        <div className="card empty">
          <div className="big"><Icon name="dumbbell" size={26} /></div>
          <h3>No workouts yet</h3>
          <p className="muted" style={{ margin: "8px 0 20px" }}>
            Log your first session to unlock stats, charts and AI coaching.
          </p>
          <Link to="/log" className="btn primary"><Icon name="plus" size={18} /> Log a workout</Link>
        </div>
      ) : (
        <>
          {/* Hero: weekly goal ring + quick start */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="row wrap" style={{ justifyContent: "space-between", gap: 24 }}>
              <div className="row" style={{ gap: 20 }}>
                <ProgressRing
                  value={Math.min(summary.workoutsThisWeek, WEEKLY_GOAL)}
                  max={WEEKLY_GOAL}
                  label={`${summary.workoutsThisWeek}/${WEEKLY_GOAL}`}
                  sub="this week"
                />
                <div>
                  <div className="muted" style={{ fontSize: "0.9rem" }}>Weekly goal</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, margin: "4px 0 8px" }}>
                    {summary.workoutsThisWeek >= WEEKLY_GOAL ? "Goal smashed 🎯" : `${WEEKLY_GOAL - summary.workoutsThisWeek} to go`}
                  </div>
                  <div className="row" style={{ gap: 8, color: "var(--text-2)", fontSize: "0.9rem" }}>
                    <Icon name="flame" size={16} /> {summary.streak}-day streak
                  </div>
                </div>
              </div>
              <Link to="/history" className="btn" style={{ alignSelf: "center" }}>
                <Icon name="history" size={17} /> History
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid cols-4" style={{ marginBottom: 8 }}>
            <Stat ico="calendar" label="This week" value={summary.workoutsThisWeek} suffix="sessions" />
            <Stat ico="trending" label="Volume (week)" value={fmt(summary.weekVolume)} suffix="kg" />
            <Stat ico="flame" label="Calories (week)" value={fmt(weekCalories)} suffix="est." />
            <Stat ico="clock" label="Time (week)" value={weekMinutes || "—"} suffix={weekMinutes ? "min" : ""} />
          </div>

          {/* Volume chart */}
          <div className="section-head">
            <h2>Training volume</h2>
            <span className="faint" style={{ fontSize: "0.85rem" }}>Last 30 days</span>
          </div>
          <div className="card" style={{ height: 280 }}>
            {volume.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volume} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={shortDate} tickMargin={8} />
                  <YAxis stroke="#71717a" fontSize={12} width={44} />
                  <Tooltip
                    contentStyle={{ background: "#181818", border: "1px solid #2a2a2a", borderRadius: 12, color: "#fff" }}
                    labelFormatter={shortDate}
                    formatter={(v) => [`${fmt(v)} kg`, "Volume"]}
                    cursor={{ stroke: "var(--accent)", strokeOpacity: 0.3 }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="var(--accent)" strokeWidth={2.5} fill="url(#vol)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty">No volume in this window yet.</div>
            )}
          </div>

          {/* Recent workouts */}
          <div className="section-head">
            <h2>Recent workouts</h2>
            <Link to="/history" className="btn ghost sm">View all</Link>
          </div>
          {recent.length ? (
            <div>
              {recent.map((w) => (
                <Link to="/history" className="list-row" key={w._id}>
                  <span className="icon-badge" style={{ width: 40, height: 40 }}>
                    <Icon name="dumbbell" size={18} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{w.title}</div>
                    <div className="faint" style={{ fontSize: "0.85rem" }}>
                      {shortDate(w.date)} · {w.exercises.length} exercise{w.exercises.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <span className="chip accent">{fmt(volOf(w))} kg</span>
                  <Icon name="chevronDown" size={16} className="faint" style={{ transform: "rotate(-90deg)" }} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="card empty">Nothing logged yet.</div>
          )}

          {/* PRs */}
          <div className="section-head">
            <h2>Personal records</h2>
            <span className="faint" style={{ fontSize: "0.85rem" }}>Est. 1RM</span>
          </div>
          <div className="card">
            {prs.length ? (
              <table>
                <thead>
                  <tr><th>Exercise</th><th>Best set</th><th>Est. 1RM</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {prs.slice(0, 8).map((p) => (
                    <tr key={p.name}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td className="muted">{p.reps} × {p.weight} kg</td>
                      <td><span className="chip accent">{p.e1rm} kg</span></td>
                      <td className="muted">{shortDate(p.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty">Log some weighted sets to see PRs.</div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function Stat({ ico, label, value, suffix }) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span className="stat-ico"><Icon name={ico} size={18} /></span>
        <span className="label">{label}</span>
      </div>
      <div className="value">
        {value} {suffix && <small>{suffix}</small>}
      </div>
    </div>
  );
}

const fmt = (n) => Math.round(n || 0).toLocaleString();
const shortDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const volOf = (w) =>
  w.exercises.reduce((t, ex) => t + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0);

// Rough estimate: ~6 kcal/min of resistance training (defaults to a 45-min
// session when no duration was logged). Clearly labelled "est." in the UI.
function estCalories(w) {
  const mins = w.durationMin || 45;
  return Math.round(mins * 6);
}

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
