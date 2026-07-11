import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import Icon from "../components/Icon.jsx";
import { queueProgramDay } from "../lib/startProgram.js";
import { getProgram, GOAL_COLOR } from "../lib/programs.js";

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const program = getProgram(id);
  const [byName, setByName] = useState({});

  useEffect(() => {
    api.listExercises()
      .then((list) => setByName(Object.fromEntries(list.map((e) => [e.name, e]))))
      .catch(() => {});
  }, []);

  if (!program) {
    return (
      <div className="card empty">
        <div className="big"><Icon name="programs" size={26} /></div>
        <h3>Program not found</h3>
        <Link to="/programs" className="btn primary" style={{ marginTop: 12 }}>Back to programs</Link>
      </div>
    );
  }

  const startDay = (day) => {
    queueProgramDay(day.exercises, byName);
    toast(`${day.label} loaded into the logger`);
    navigate("/log");
  };

  return (
    <>
      <Link to="/programs" className="btn ghost sm" style={{ marginBottom: 16 }}>
        <Icon name="chevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Programs
      </Link>

      {/* Hero */}
      <div className="prog-hero" style={{ backgroundImage: `url(${program.cover})` }}>
        <div className="prog-hero-inner">
          <div className="row wrap" style={{ gap: 8, marginBottom: 10 }}>
            <span className={"badge " + program.level.toLowerCase()}>{program.level}</span>
            <span className="prog-goal" style={{ color: GOAL_COLOR[program.goal] }}>
              <span className="dot" style={{ background: GOAL_COLOR[program.goal] }} /> {program.goal}
            </span>
          </div>
          <h1>{program.name}</h1>
          <div className="prog-hero-meta">
            <span><Icon name="calendar" size={16} /> {program.daysPerWeek} days / week</span>
            <span><Icon name="clock" size={16} /> {program.duration}</span>
          </div>
          <p className="prog-hero-desc">{program.description}</p>
          <button className="btn primary" onClick={() => startDay(program.dayDefs[0])}>
            <Icon name="play" size={17} /> Start Program
          </button>
        </div>
      </div>

      {/* Weekly schedule */}
      <h2 className="section-title">Weekly schedule</h2>
      <div className="week-grid">
        {program.schedule.map((s, i) => (
          <div key={i} className={"week-day" + (s.rest ? " rest" : "")}>
            <div className="week-dow">{s.day}</div>
            <div className="week-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Training days */}
      <h2 className="section-title">Training days</h2>
      <p className="faint" style={{ marginTop: -8, marginBottom: 14, fontSize: "0.86rem" }}>
        Sets × reps · rest · <strong>RIR</strong> = reps in reserve (how many reps to leave short of failure).
      </p>
      {program.dayDefs.map((day) => (
        <div className="card" key={day.key} style={{ marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <h3 className="row" style={{ gap: 8 }}><Icon name="dumbbell" size={18} /> {day.label}</h3>
            <button className="btn sm" onClick={() => startDay(day)}>
              <Icon name="play" size={14} /> Start this day
            </button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th style={{ width: 34 }}>#</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>RIR</th><th>Rest</th></tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr key={i}>
                    <td className="faint">{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{ex.name}</td>
                    <td>{ex.sets}</td>
                    <td className="muted">{ex.reps}</td>
                    <td className="muted">{ex.rir || "—"}</td>
                    <td className="muted">{ex.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Guidance */}
      <div className="grid cols-2" style={{ alignItems: "start" }}>
        <Guide title="Warm-up" icon="flame" items={program.warmup} />
        <Guide title="Cool-down" icon="heart" items={program.cooldown} />
      </div>
      <div className="grid cols-2" style={{ alignItems: "start", marginTop: 16 }}>
        <Guide title={`${program.level} tips`} icon="sparkles" items={program.tips} />
        <div className="card">
          <h3 className="row" style={{ gap: 8, marginBottom: 10 }}><Icon name="trending" size={18} /> Progressive overload</h3>
          <p className="muted" style={{ lineHeight: 1.6 }}>{program.overload}</p>
        </div>
      </div>
    </>
  );
}

function Guide({ title, icon, items }) {
  return (
    <div className="card">
      <h3 className="row" style={{ gap: 8, marginBottom: 12 }}><Icon name={icon} size={18} /> {title}</h3>
      <ul className="viewer-steps" style={{ listStyle: "disc" }}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
