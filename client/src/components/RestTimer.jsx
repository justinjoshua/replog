import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";

const PRESETS = [60, 90, 120];
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Compact per-exercise rest countdown with presets, start/pause and reset. */
export default function RestTimer() {
  const [target, setTarget] = useState(90);
  const [left, setLeft] = useState(90);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const pick = (s) => {
    setTarget(s);
    setLeft(s);
    setRunning(false);
  };
  const reset = () => {
    setLeft(target);
    setRunning(false);
  };

  return (
    <div className="row wrap" style={{ gap: 8 }}>
      <span className={"timer" + (running ? " running" : "")}>
        <Icon name="timer" size={16} /> {fmt(left)}
      </span>
      <button className="btn sm" onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : left === 0 ? "Done" : "Start"}
      </button>
      <button className="btn ghost sm" onClick={reset} disabled={left === target && !running}>
        Reset
      </button>
      <div className="row" style={{ gap: 4 }}>
        {PRESETS.map((s) => (
          <button
            key={s}
            className={"chip" + (target === s ? " accent" : "")}
            onClick={() => pick(s)}
            style={{ padding: "3px 9px" }}
          >
            {s}s
          </button>
        ))}
      </div>
    </div>
  );
}
