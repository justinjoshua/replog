import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import Icon from "../components/Icon.jsx";

export default function Coach({ aiOn }) {
  const toast = useToast();
  const navigate = useNavigate();

  const [opts, setOpts] = useState({
    goal: "Strength & hypertrophy",
    equipment: "Full gym",
    durationMin: 45,
    muscles: "",
    level: "Intermediate",
  });
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [report, setReport] = useState("");
  const [coaching, setCoaching] = useState(false);

  if (!aiOn)
    return (
      <>
        <div className="page-head">
          <h1>AI Coach</h1>
          <p>Workout generation and progress analysis, powered by Google Gemini.</p>
        </div>
        <div className="card empty">
          <div className="big"><Icon name="sparkles" size={26} /></div>
          <h3>AI features are off</h3>
          <p className="muted" style={{ maxWidth: 460, margin: "8px auto 0" }}>
            Add a <code>GEMINI_API_KEY</code> to <code>server/.env</code> and restart the
            server to unlock the workout generator and your personal progress coach.
            Get a free key at aistudio.google.com/apikey.
          </p>
        </div>
      </>
    );

  async function generate() {
    setGenerating(true);
    setPlan(null);
    try {
      setPlan(await api.aiGenerate(opts));
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setGenerating(false);
    }
  }

  async function savePlan() {
    try {
      await api.createWorkout({
        title: plan.title,
        notes: plan.notes || "",
        exercises: plan.exercises,
        date: new Date().toISOString(),
      });
      toast("Plan saved to your log");
      navigate("/history");
    } catch (e) {
      toast(e.message, "err");
    }
  }

  async function getCoaching() {
    setCoaching(true);
    setReport("");
    try {
      const { report } = await api.aiCoach();
      setReport(report);
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setCoaching(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>AI Coach</h1>
        <p>Generate a session or get feedback on your recent training.</p>
      </div>

      <div className="grid cols-2" style={{ alignItems: "start" }}>
        {/* Generator */}
        <div className="card">
          <h3 className="row" style={{ marginBottom: 16, gap: 8 }}><Icon name="zap" size={19} /> Generate a workout</h3>
          <div className="field">
            <label>Goal</label>
            <input value={opts.goal} onChange={(e) => setOpts({ ...opts, goal: e.target.value })} />
          </div>
          <div className="grid cols-2">
            <div className="field">
              <label>Equipment</label>
              <input value={opts.equipment} onChange={(e) => setOpts({ ...opts, equipment: e.target.value })} />
            </div>
            <div className="field">
              <label>Duration (min)</label>
              <input
                type="number"
                value={opts.durationMin}
                onChange={(e) => setOpts({ ...opts, durationMin: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid cols-2">
            <div className="field">
              <label>Focus muscles</label>
              <input
                placeholder="e.g. chest, triceps"
                value={opts.muscles}
                onChange={(e) => setOpts({ ...opts, muscles: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Level</label>
              <select value={opts.level} onChange={(e) => setOpts({ ...opts, level: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <button className="btn primary block" onClick={generate} disabled={generating}>
            {generating ? <><span className="spinner" /> Designing…</> : <><Icon name="sparkles" size={17} /> Generate</>}
          </button>

          {plan && (
            <div style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <strong style={{ fontSize: "1.05rem" }}>{plan.title}</strong>
              {plan.notes && <p className="muted" style={{ margin: "6px 0 12px" }}>{plan.notes}</p>}
              {plan.exercises?.map((ex, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{ex.name}</span>
                  <span className="muted"> — {ex.sets.length} × {ex.sets[0]?.reps ?? "?"} reps</span>
                </div>
              ))}
              <button className="btn primary sm" style={{ marginTop: 12 }} onClick={savePlan}>
                <Icon name="check" size={16} /> Save to my log
              </button>
            </div>
          )}
        </div>

        {/* Coaching */}
        <div className="card">
          <h3 className="row" style={{ marginBottom: 10, gap: 8 }}><Icon name="trending" size={19} /> Progress coach</h3>
          <p className="muted" style={{ marginBottom: 14, fontSize: "0.9rem" }}>
            Gemini analyzes your last 20 workouts for trends, plateaus and imbalances,
            then suggests what to do next.
          </p>
          <button className="btn primary block" onClick={getCoaching} disabled={coaching}>
            {coaching ? <><span className="spinner" /> Analyzing…</> : <><Icon name="trending" size={17} /> Analyze my training</>}
          </button>

          {report && (
            <div
              style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16 }}
              dangerouslySetInnerHTML={{ __html: mdToHtml(report) }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// Minimal markdown -> HTML (headings, bold, bullets, paragraphs). Enough for
// Gemini's short coaching reports; input is model text, rendered into our own page.
function mdToHtml(md) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = esc(md).split("\n");
  let html = "";
  let inList = false;
  for (let line of lines) {
    line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html += "<ul style='margin:6px 0 6px 18px'>";
        inList = true;
      }
      html += `<li style='margin:4px 0'>${line.replace(/^\s*[-*]\s+/, "")}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (/^#{1,4}\s/.test(line))
        html += `<h4 style='margin:12px 0 4px'>${line.replace(/^#{1,4}\s/, "")}</h4>`;
      else if (line.trim()) html += `<p style='margin:8px 0'>${line}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}
