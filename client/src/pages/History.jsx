import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import { LineSkeleton } from "../components/Skeleton.jsx";
import Icon from "../components/Icon.jsx";

export default function History() {
  const toast = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const load = () =>
    api
      .listWorkouts()
      .then(setWorkouts)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Delete this workout?")) return;
    try {
      await api.deleteWorkout(id);
      setWorkouts((w) => w.filter((x) => x._id !== id));
      toast("Workout deleted");
    } catch (e) {
      toast(e.message, "err");
    }
  }

  if (loading)
    return (
      <>
        <div className="page-head">
          <h1>History</h1>
          <p>Loading your sessions…</p>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card" key={i} style={{ marginBottom: 12 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <LineSkeleton w="180px" h={20} />
              <LineSkeleton w="80px" h={20} />
            </div>
          </div>
        ))}
      </>
    );

  return (
    <>
      <div className="page-head">
        <h1>History</h1>
        <p>{workouts.length} logged session{workouts.length === 1 ? "" : "s"}.</p>
      </div>

      {!workouts.length ? (
        <div className="card empty">
          <div className="big"><Icon name="history" size={26} /></div>
          <h3>Nothing logged yet</h3>
          <p className="muted" style={{ margin: "8px 0 18px" }}>
            Your saved workouts will appear here.
          </p>
          <Link to="/log" className="btn primary"><Icon name="plus" size={17} /> Log a workout</Link>
        </div>
      ) : (
        workouts.map((w) => {
          const volume = w.exercises.reduce(
            (t, ex) => t + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
            0
          );
          const isOpen = open === w._id;
          return (
            <div className="card interactive" key={w._id} style={{ marginBottom: 12 }}>
              <div
                className="row"
                style={{ justifyContent: "space-between", cursor: "pointer" }}
                onClick={() => setOpen(isOpen ? null : w._id)}
              >
                <div>
                  <strong style={{ fontSize: "1.05rem" }}>{w.title}</strong>
                  <div className="muted" style={{ fontSize: "0.85rem", marginTop: 2 }}>
                    {new Date(w.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {w.exercises.length} exercise{w.exercises.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="row">
                  <span className="chip accent">{Math.round(volume).toLocaleString()} kg</span>
                  <Icon name={isOpen ? "chevronUp" : "chevronDown"} size={18} className="faint" />
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  {w.notes && <p className="muted" style={{ marginBottom: 12 }}>“{w.notes}”</p>}
                  {w.exercises.map((ex, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {ex.name}
                        <span className="mtag primary">{ex.muscleGroup}</span>
                        {ex.equipment && <span className="badge equip">{ex.equipment}</span>}
                      </div>
                      <div className="muted" style={{ fontSize: "0.88rem" }}>
                        {ex.sets.map((s, si) => (
                          <span key={si} style={{ marginRight: 14 }}>
                            {s.reps} × {s.weight}kg
                          </span>
                        ))}
                      </div>
                      {ex.notes && (
                        <div className="faint row" style={{ fontSize: "0.84rem", marginTop: 4, gap: 6 }}>
                          <Icon name="pencil" size={13} /> {ex.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="btn danger sm" onClick={() => remove(w._id)}>Delete workout</button>
                </div>
              )}
            </div>
          );
        })
      )}
    </>
  );
}
