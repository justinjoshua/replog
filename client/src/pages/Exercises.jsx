import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import { useFavorites } from "../hooks/useLocalStorage.js";
import { MUSCLES, EQUIPMENT, DIFFICULTIES } from "../lib/exerciseMeta.js";
import ExerciseCard from "../components/ExerciseCard.jsx";
import Icon, { muscleIcon } from "../components/Icon.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";

// Cross-page bridge: queue exercises for the logger, then jump there.
function queueForLog(ex) {
  const key = "replog.pending";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(
    key,
    JSON.stringify([
      ...prev,
      {
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment || "",
        secondaryMuscles: ex.secondaryMuscles || [],
      },
    ])
  );
}

export default function Exercises() {
  const toast = useToast();
  const navigate = useNavigate();
  const { favorites, toggle, isFavorite } = useFavorites();

  const [groups, setGroups] = useState([]);
  const [allByName, setAllByName] = useState({});
  const [loading, setLoading] = useState(true);
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [q, setQ] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
  });

  // Full catalog (unfiltered) for resolving favorites regardless of filters.
  useEffect(() => {
    api
      .listExercises()
      .then((list) => setAllByName(Object.fromEntries(list.map((e) => [e.name, e]))))
      .catch(() => {});
  }, []);

  // Filtered, grouped catalog for the grid. Debounced on the search box.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (muscle) p.set("muscle", muscle);
      if (equipment) p.set("equipment", equipment);
      if (q) p.set("q", q);
      const qs = p.toString();
      api
        .exerciseGroups(qs ? `?${qs}` : "")
        .then(setGroups)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [muscle, equipment, q]);

  // Favorites rail also respects the active filters, so "Chest" really shows
  // only chest — favorites and grid stay consistent.
  const favCards = useMemo(
    () =>
      favorites
        .map((n) => allByName[n])
        .filter(Boolean)
        .filter(
          (ex) =>
            (!muscle || ex.muscleGroup === muscle) &&
            (!equipment || ex.equipment === equipment) &&
            (!q || ex.name.toLowerCase().includes(q.toLowerCase()))
        ),
    [favorites, allByName, muscle, equipment, q]
  );

  const totalVariations = useMemo(
    () => groups.reduce((n, g) => n + g.variations.length, 0),
    [groups]
  );

  function refetch() {
    const p = new URLSearchParams();
    if (muscle) p.set("muscle", muscle);
    if (equipment) p.set("equipment", equipment);
    if (q) p.set("q", q);
    const qs = p.toString();
    api.exerciseGroups(qs ? `?${qs}` : "").then(setGroups).catch(() => {});
    api
      .listExercises()
      .then((list) => setAllByName(Object.fromEntries(list.map((e) => [e.name, e]))))
      .catch(() => {});
  }

  async function addCustom(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.createExercise(form);
      setForm({ ...form, name: "" });
      setShowAdd(false);
      toast("Exercise added to your library");
      refetch();
    } catch (err) {
      toast(err.message, "err");
    }
  }

  async function remove(ex) {
    try {
      await api.deleteExercise(ex._id);
      toast("Exercise removed");
      refetch();
    } catch (err) {
      toast(err.message, "err");
    }
  }

  function addToWorkout(ex) {
    queueForLog(ex);
    toast(`${ex.name} added — opening logger`);
    navigate("/log");
  }

  const filtersOn = muscle || equipment || q;

  return (
    <>
      <div className="page-head row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1>Exercises</h1>
          <p>Browse every movement and its variations — switch, randomize, and build.</p>
        </div>
        <button className="btn primary" onClick={() => setShowAdd((s) => !s)}>
          {showAdd ? <><Icon name="close" size={16} /> Close</> : <><Icon name="plus" size={16} /> New exercise</>}
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={addCustom} className="grid cols-4" style={{ alignItems: "end", gap: 12 }}>
            <div className="field" style={{ margin: 0, gridColumn: "span 1" }}>
              <label>Name</label>
              <input
                placeholder="e.g. Landmine Press"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Muscle</label>
              <select value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}>
                {MUSCLES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Equipment</label>
              <select value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })}>
                {EQUIPMENT.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Difficulty</label>
              <div className="row" style={{ gap: 8 }}>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  style={{ flex: 1 }}
                >
                  {DIFFICULTIES.map((m) => <option key={m}>{m}</option>)}
                </select>
                <button className="btn primary">Add</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="row wrap" style={{ marginBottom: 18, gap: 12 }}>
        <div className="search" style={{ flex: "1 1 220px", maxWidth: 300 }}>
          <Icon name="search" size={18} />
          <input placeholder="Search exercises…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select value={equipment} onChange={(e) => setEquipment(e.target.value)} style={{ maxWidth: 170 }}>
          <option value="">All equipment</option>
          {EQUIPMENT.map((m) => <option key={m}>{m}</option>)}
        </select>
        {filtersOn && (
          <button className="btn ghost sm" onClick={() => { setMuscle(""); setEquipment(""); setQ(""); }}>
            Clear
          </button>
        )}
      </div>

      <div className="row wrap" style={{ marginBottom: 22, gap: 6 }}>
        <button className={"chip" + (muscle === "" ? " accent" : "")} onClick={() => setMuscle("")}>All</button>
        {MUSCLES.map((m) => (
          <button key={m} className={"chip" + (muscle === m ? " accent" : "")} onClick={() => setMuscle(m)}>
            {m}
          </button>
        ))}
      </div>

      {/* Favorites rail */}
      {favCards.length > 0 && (
        <>
          <div className="section-title"><Icon name="star" size={18} /> Favorites <span className="count">{favCards.length}</span></div>
          <div className="rail" style={{ marginBottom: 22 }}>
            {favCards.map((ex) => (
              <div className="rail-card" key={ex._id || ex.name}>
                <span className="icon-badge" style={{ width: 38, height: 38 }}>
                  <Icon name={muscleIcon(ex.muscleGroup)} size={18} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ex.name}
                  </div>
                  <div className="faint" style={{ fontSize: "0.76rem" }}>{ex.muscleGroup}</div>
                </div>
                <button className="fav-btn on" style={{ position: "static" }} onClick={() => toggle(ex.name)} title="Remove">
                  <Icon name="star" size={17} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Grid */}
      <div className="section-title">
        {muscle || "All movements"}
        {!loading && <span className="count">{groups.length} movements · {totalVariations} variations</span>}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : groups.length ? (
        <div className="ex-grid">
          {groups.map((g) => (
            <ExerciseCard
              key={g.group}
              group={g}
              isFavorite={isFavorite}
              onToggleFav={toggle}
              onAdd={addToWorkout}
              onDelete={remove}
            />
          ))}
        </div>
      ) : (
        <div className="card empty">
          <div className="big"><Icon name="search" size={26} /></div>
          <h3>No exercises match</h3>
          <p className="muted">Try a different muscle, equipment, or search term.</p>
        </div>
      )}
    </>
  );
}
