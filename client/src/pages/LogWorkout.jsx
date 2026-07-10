import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useToast } from "../toast.jsx";
import { useFavorites, useRecent, useSplits } from "../hooks/useLocalStorage.js";
import { EQUIPMENT } from "../lib/exerciseMeta.js";
import {
  DAY_TEMPLATES,
  buildDayPlan,
  SPLIT_MUSCLES,
  SPLIT_ICONS,
  makeSplit,
} from "../lib/dayTemplates.js";
import RestTimer from "../components/RestTimer.jsx";
import Icon, { muscleIcon } from "../components/Icon.jsx";

const blankSet = () => ({ reps: 8, weight: 0 });

export default function LogWorkout({ aiOn }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { recent, push } = useRecent();

  const [library, setLibrary] = useState([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([]);
  const [saving, setSaving] = useState(false);

  // AI panel
  const [aiText, setAiText] = useState("");
  const [parsing, setParsing] = useState(false);

  // Workout-day builder
  const { splits, addSplit, removeSplit } = useSplits();
  const [dayKey, setDayKey] = useState("");
  const [dayEquip, setDayEquip] = useState("Any");
  const [dayCount, setDayCount] = useState(5);
  const [aiBuilding, setAiBuilding] = useState(false);

  // Custom-split creator
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [splitName, setSplitName] = useState("");
  const [splitMuscles, setSplitMuscles] = useState([]);
  const [splitIcon, setSplitIcon] = useState("star");

  const allDays = [...DAY_TEMPLATES, ...splits];
  const day = allDays.find((d) => d.key === dayKey) || null;
  const activeMuscles = day?.muscles || null;

  const byName = useMemo(
    () => Object.fromEntries(library.map((e) => [e.name, e])),
    [library]
  );

  // When a day is picked, only surface that day's movements in autocomplete.
  const datalistLib = useMemo(
    () => (activeMuscles ? library.filter((e) => activeMuscles.includes(e.muscleGroup)) : library),
    [library, activeMuscles]
  );

  useEffect(() => {
    api.listExercises().then(setLibrary).catch(() => {});
  }, []);

  // Drain any exercises queued from the Exercises page ("+ Add to workout").
  useEffect(() => {
    try {
      const pending = JSON.parse(localStorage.getItem("replog.pending") || "[]");
      if (pending.length) {
        setExercises((xs) => [
          ...xs,
          ...pending.map((p) => ({
            name: p.name,
            muscleGroup: p.muscleGroup || "Other",
            equipment: p.equipment || "",
            notes: "",
            sets: Array.from({ length: p.setCount || 1 }, () => ({
              reps: p.reps || 8,
              weight: 0,
            })),
          })),
        ]);
        localStorage.removeItem("replog.pending");
      }
    } catch {
      /* ignore malformed queue */
    }
  }, []);

  const addExercise = (name = "", muscleGroup = "Other", equipment = "") =>
    setExercises((xs) => [...xs, { name, muscleGroup, equipment, notes: "", sets: [blankSet()] }]);

  const quickAdd = (name) => {
    const ex = byName[name];
    addExercise(name, ex?.muscleGroup || "Other", ex?.equipment || "");
  };

  const updateExercise = (i, patch) =>
    setExercises((xs) => xs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const removeExercise = (i) =>
    setExercises((xs) => xs.filter((_, idx) => idx !== i));

  const addSet = (i) =>
    updateExercise(i, {
      sets: [...exercises[i].sets, { ...(exercises[i].sets.at(-1) || blankSet()) }],
    });

  const updateSet = (i, si, patch) =>
    updateExercise(i, {
      sets: exercises[i].sets.map((s, idx) => (idx === si ? { ...s, ...patch } : s)),
    });

  const removeSet = (i, si) =>
    updateExercise(i, { sets: exercises[i].sets.filter((_, idx) => idx !== si) });

  const toggleSplitMuscle = (m) =>
    setSplitMuscles((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]));

  function saveSplit() {
    const label = splitName.trim();
    if (!label || !splitMuscles.length) return;
    const split = makeSplit(label, splitMuscles, splitIcon);
    addSplit(split);
    setDayKey(split.key); // select the new split immediately
    setShowSplitForm(false);
    setSplitName("");
    setSplitMuscles([]);
    setSplitIcon("star");
    toast(`Saved "${label}" split`);
  }

  function deleteCurrentSplit() {
    if (!day?.custom) return;
    removeSplit(day.key);
    setDayKey("");
    toast("Split removed");
  }

  // Instant, offline: assemble a session from the library for the chosen day.
  function autoBuildDay() {
    if (!day) return;
    const plan = buildDayPlan(library, {
      muscles: day.muscles,
      equipment: dayEquip,
      count: Number(dayCount),
    });
    if (!plan.length) return toast("No exercises found for that filter", "err");
    setExercises(plan);
    if (!title) setTitle(`${day.label} Day`);
    toast(`Built a ${day.label.toLowerCase()} day — ${plan.length} exercises`);
  }

  // Smarter plan via Gemini, scoped to the day's muscles + your equipment.
  async function aiBuildDay() {
    if (!day) return;
    setAiBuilding(true);
    try {
      const plan = await api.aiGenerate({
        goal: `${day.label} day`,
        equipment: dayEquip === "Any" ? "Full gym" : dayEquip,
        durationMin: Number(dayCount) * 10,
        muscles: day.muscles.join(", "),
        level: "Intermediate",
      });
      setExercises((plan.exercises || []).map((e) => ({ ...e, notes: e.notes || "" })));
      if (plan.title) setTitle(plan.title);
      toast(`AI designed your ${day.label.toLowerCase()} day`);
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setAiBuilding(false);
    }
  }

  async function runAI() {
    if (!aiText.trim()) return;
    setParsing(true);
    try {
      const draft = await api.aiParse(aiText);
      if (draft.title && !title) setTitle(draft.title);
      setExercises((xs) => [...xs, ...(draft.exercises || [])]);
      setAiText("");
      toast("AI added your workout — review and save");
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setParsing(false);
    }
  }

  async function save() {
    if (!exercises.length) return toast("Add at least one exercise", "err");
    setSaving(true);
    try {
      // Backfill the machine/equipment from the library for any entry that
      // came from AI or free text, so every saved exercise names its equipment.
      const withEquip = exercises.map((ex) => ({
        ...ex,
        equipment: ex.equipment || byName[ex.name]?.equipment || "",
      }));
      await api.createWorkout({
        title: title || "Workout",
        notes,
        exercises: withEquip,
        date: new Date().toISOString(),
      });
      exercises.forEach((ex) => ex.name && push(ex.name)); // feed "recently used"
      toast("Workout saved");
      navigate("/history");
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setSaving(false);
    }
  }

  const totalVolume = exercises.reduce(
    (t, ex) => t + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );

  const quickChips = [...favorites, ...recent.filter((n) => !favorites.includes(n))]
    .filter((n) => !activeMuscles || activeMuscles.includes(byName[n]?.muscleGroup))
    .slice(0, 10);

  return (
    <>
      <div className="page-head">
        <h1>Log Workout</h1>
        <p>Pick a training day, describe it to AI, or build it by hand.</p>
      </div>

      {/* Workout-day builder */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <strong className="row" style={{ gap: 8 }}><Icon name="calendar" size={18} /> Workout day</strong>
          <div className="row" style={{ gap: 8 }}>
            {dayKey && (
              <button className="btn ghost sm" onClick={() => setDayKey("")}>Clear</button>
            )}
            <button className="btn sm" onClick={() => setShowSplitForm((s) => !s)}>
              {showSplitForm ? <><Icon name="close" size={15} /> Close</> : <><Icon name="plus" size={15} /> New split</>}
            </button>
          </div>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          {allDays.map((d) => (
            <button
              key={d.key}
              className={"chip" + (dayKey === d.key ? " accent" : "")}
              onClick={() => setDayKey(d.key)}
            >
              <Icon name={d.icon} size={15} /> {d.label}
            </button>
          ))}
        </div>

        {showSplitForm && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <div className="field">
              <label>Split name</label>
              <input
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                placeholder="e.g. Chest + Triceps"
                style={{ maxWidth: 320 }}
              />
            </div>
            <label>Muscle groups</label>
            <div className="row wrap" style={{ gap: 6, margin: "6px 0 14px" }}>
              {SPLIT_MUSCLES.map((m) => (
                <button
                  key={m}
                  className={"chip" + (splitMuscles.includes(m) ? " accent" : "")}
                  onClick={() => toggleSplitMuscle(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <label>Icon</label>
            <div className="row wrap" style={{ gap: 6, margin: "6px 0 16px" }}>
              {SPLIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  className={"btn icon" + (splitIcon === ic ? " primary" : "")}
                  onClick={() => setSplitIcon(ic)}
                  title={ic}
                >
                  <Icon name={ic} size={18} />
                </button>
              ))}
            </div>
            <button
              className="btn primary"
              onClick={saveSplit}
              disabled={!splitName.trim() || !splitMuscles.length}
            >
              Save split
            </button>
          </div>
        )}

        {day && (
          <>
            <div className="row wrap" style={{ gap: 12, marginTop: 16, alignItems: "flex-end" }}>
              <div className="field" style={{ margin: 0, minWidth: 150 }}>
                <label>Equipment</label>
                <select value={dayEquip} onChange={(e) => setDayEquip(e.target.value)}>
                  <option>Any</option>
                  {EQUIPMENT.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0, width: 120 }}>
                <label>Exercises</label>
                <select value={dayCount} onChange={(e) => setDayCount(Number(e.target.value))}>
                  {[3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button className="btn primary" onClick={autoBuildDay}>
                <Icon name="zap" size={17} /> Auto-build {day.label}
              </button>
              {aiOn && (
                <button className="btn" onClick={aiBuildDay} disabled={aiBuilding}>
                  {aiBuilding ? <><span className="spinner" /> Designing…</> : <><Icon name="sparkles" size={17} /> AI build</>}
                </button>
              )}
              {day.custom && (
                <button className="btn danger" onClick={deleteCurrentSplit}>
                  <Icon name="trash" size={16} /> Delete split
                </button>
              )}
            </div>
            <p className="faint" style={{ fontSize: "0.8rem", marginTop: 12 }}>
              Showing only {day.muscles.join(", ")} movements for this session.
            </p>
          </>
        )}
      </div>

      {/* AI quick-log */}
      <div className="card" style={{ marginBottom: 20, borderColor: aiOn ? "var(--accent)" : "var(--border)" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <strong className="row" style={{ gap: 8 }}><Icon name="sparkles" size={18} /> Quick log with AI</strong>
          {!aiOn && <span className="chip">Add GEMINI_API_KEY to enable</span>}
        </div>
        <textarea
          rows={2}
          placeholder='e.g. "3x8 bench press at 60kg, 4x10 barbell rows at 40, then 3 sets of 12 curls with 15kg"'
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          disabled={!aiOn}
        />
        <div style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={runAI} disabled={!aiOn || parsing || !aiText.trim()}>
            {parsing ? <><span className="spinner" /> Parsing…</> : "Parse with AI"}
          </button>
        </div>
      </div>

      {/* Quick-add from favorites / recent */}
      {quickChips.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Quick add
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {quickChips.map((n) => (
              <button key={n} className="chip" onClick={() => quickAdd(n)}>
                <Icon name={favorites.includes(n) ? "star" : "clock"} size={14} /> {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="grid cols-2">
          <div className="field" style={{ margin: 0 }}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Push Day" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Felt strong today" />
          </div>
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((ex, i) => (
        <div className="card" key={i} style={{ marginBottom: 14 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <div className="row" style={{ gap: 10, minWidth: 0 }}>
              <span className="icon-badge" style={{ width: 38, height: 38 }}>
                <Icon name={muscleIcon((byName[ex.name] || ex).muscleGroup)} size={18} />
              </span>
              <input
                list="exercise-list"
                value={ex.name}
                placeholder="Exercise name"
                onChange={(e) => {
                  const match = byName[e.target.value];
                  updateExercise(i, {
                    name: e.target.value,
                    muscleGroup: match?.muscleGroup || ex.muscleGroup,
                    equipment: match?.equipment ?? ex.equipment ?? "",
                  });
                }}
                style={{ maxWidth: 240, fontWeight: 600 }}
              />
              {(ex.equipment || byName[ex.name]?.equipment) && (
                <span className="badge equip">{ex.equipment || byName[ex.name]?.equipment}</span>
              )}
            </div>
            <button className="btn danger sm icon" onClick={() => removeExercise(i)} title="Remove exercise">
              <Icon name="trash" size={16} />
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ width: 50 }}>Set</th>
                <th>Reps</th>
                <th>Weight (kg)</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {ex.sets.map((s, si) => (
                <tr key={si}>
                  <td className="muted">{si + 1}</td>
                  <td>
                    <input
                      type="number"
                      value={s.reps}
                      min={0}
                      onChange={(e) => updateSet(i, si, { reps: Number(e.target.value) })}
                      style={{ maxWidth: 110 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={s.weight}
                      min={0}
                      step={2.5}
                      onChange={(e) => updateSet(i, si, { weight: Number(e.target.value) })}
                      style={{ maxWidth: 110 }}
                    />
                  </td>
                  <td>
                    {ex.sets.length > 1 && (
                      <button className="btn danger sm icon" onClick={() => removeSet(i, si)} title="Remove set">
                        <Icon name="close" size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row wrap" style={{ justifyContent: "space-between", marginTop: 12, gap: 12 }}>
            <button className="btn sm ghost" onClick={() => addSet(i)}><Icon name="plus" size={15} /> Add set</button>
            <RestTimer />
          </div>

          <input
            style={{ marginTop: 12 }}
            placeholder="Notes for this exercise (optional)…"
            value={ex.notes || ""}
            onChange={(e) => updateExercise(i, { notes: e.target.value })}
          />
        </div>
      ))}

      <datalist id="exercise-list">
        {datalistLib.map((l) => (
          <option key={l._id} value={l.name} />
        ))}
      </datalist>

      <div className="row wrap" style={{ justifyContent: "space-between", marginTop: 10, gap: 12 }}>
        <button className="btn" onClick={() => addExercise()}><Icon name="plus" size={16} /> Add exercise</button>
        <div className="row">
          {totalVolume > 0 && (
            <span className="chip accent">{Math.round(totalVolume).toLocaleString()} kg</span>
          )}
          <button className="btn primary" onClick={save} disabled={saving || !exercises.length}>
            {saving ? <><span className="spinner" /> Saving…</> : <><Icon name="check" size={17} /> Save workout</>}
          </button>
        </div>
      </div>
    </>
  );
}
