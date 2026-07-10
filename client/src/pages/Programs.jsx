import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import Icon from "../components/Icon.jsx";
import ProgramCard from "../components/ProgramCard.jsx";
import { queueProgramDay } from "../lib/startProgram.js";
import { PROGRAMS, getProgram, LEVELS, GOALS, LOCATIONS } from "../lib/programs.js";

const FILTERS = [...LEVELS, ...GOALS, ...LOCATIONS];

export default function Programs() {
  const toast = useToast();
  const navigate = useNavigate();
  const [byName, setByName] = useState({});
  const [active, setActive] = useState([]);

  useEffect(() => {
    api.listExercises()
      .then((list) => setByName(Object.fromEntries(list.map((e) => [e.name, e]))))
      .catch(() => {});
  }, []);

  const toggle = (f) => setActive((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));

  const matches = (p) =>
    active.every((f) => p.level === f || p.goal === f || (p.tags || []).includes(f));

  const shown = useMemo(() => PROGRAMS.filter(matches), [active]);

  function start(p) {
    const prog = getProgram(p.id);
    const day = prog.dayDefs[0];
    queueProgramDay(day.exercises, byName);
    toast(`Starting ${p.name} — ${day.label} loaded`);
    navigate("/log");
  }

  return (
    <>
      <div className="page-head">
        <h1>Explore Programs</h1>
        <p>Ready-to-run training splits for every level — start one in a tap.</p>
      </div>

      <div className="row wrap" style={{ gap: 8, marginBottom: 24 }}>
        <button className={"chip" + (active.length === 0 ? " accent" : "")} onClick={() => setActive([])}>
          All
        </button>
        {FILTERS.map((f) => (
          <button key={f} className={"chip" + (active.includes(f) ? " accent" : "")} onClick={() => toggle(f)}>
            {f}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="prog-grid">
          {shown.map((p) => <ProgramCard key={p.id} program={p} onStart={start} />)}
        </div>
      ) : (
        <div className="card empty">
          <div className="big"><Icon name="programs" size={26} /></div>
          <h3>No programs match</h3>
          <p className="muted">Try clearing a filter or two.</p>
        </div>
      )}
    </>
  );
}
