import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { GOAL_COLOR } from "../lib/programs.js";

/** A workout-split card: cover photo, meta, description, Start + Details. */
export default function ProgramCard({ program, onStart, compact = false }) {
  const p = program;
  return (
    <div className={"prog-card" + (compact ? " compact" : "")}>
      <Link to={`/programs/${p.id}`} className="prog-cover">
        <img src={p.cover} alt="" loading="lazy" decoding="async" />
        <div className="prog-cover-shade" />
        <span className={"badge " + p.level.toLowerCase().replace(/\s/g, "")}>{p.level}</span>
        <span className="prog-goal" style={{ color: GOAL_COLOR[p.goal] || "var(--accent)" }}>
          <span className="dot" style={{ background: GOAL_COLOR[p.goal] || "var(--accent)" }} />
          {p.goal}
        </span>
        <h3 className="prog-cover-title">{p.name}</h3>
      </Link>

      <div className="prog-body">
        <div className="prog-meta">
          <span><Icon name="calendar" size={15} /> {p.daysPerWeek} days/wk</span>
          <span><Icon name="clock" size={15} /> {p.duration}</span>
        </div>
        {!compact && <p className="muted prog-desc">{p.description}</p>}
        <div className="prog-actions">
          <button className="btn primary sm" onClick={() => onStart(p)}>
            <Icon name="play" size={15} /> Start
          </button>
          <Link to={`/programs/${p.id}`} className="btn sm">
            Details <Icon name="chevronRight" size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
