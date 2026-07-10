import { useEffect, useMemo, useState } from "react";
import { difficultyClass } from "../lib/exerciseMeta.js";
import Icon, { equipIcon } from "./Icon.jsx";
import CoverImage from "./CoverImage.jsx";
import { useExerciseViewer } from "./ExerciseViewer.jsx";

/**
 * A premium exercise card built around a *base movement* and its variations.
 * Users can view the variation count, switch variation from a dropdown, or
 * randomize one with the dice. Everything (muscles, difficulty, equipment,
 * favorite state) reflects the currently-selected variation.
 *
 * Props:
 *   group        { group, icon, muscleGroup, variations: Exercise[] }
 *   isFavorite   (name) => bool
 *   onToggleFav  (name) => void
 *   onAdd        (exercise) => void   // optional "add to workout"
 *   onDelete     (exercise) => void   // optional (custom exercises)
 */
export default function ExerciseCard({ group, isFavorite, onToggleFav, onAdd, onDelete }) {
  const variations = group.variations || [];
  const [idx, setIdx] = useState(0);
  const { open } = useExerciseViewer();

  // Keep selection valid if the variation list changes (e.g. after filtering).
  useEffect(() => {
    if (idx > variations.length - 1) setIdx(0);
  }, [variations.length, idx]);

  const ex = variations[idx] || {};
  const multi = variations.length > 1;
  const fav = isFavorite?.(ex.name);

  const randomize = () => {
    if (variations.length < 2) return;
    let next = idx;
    while (next === idx) next = Math.floor(Math.random() * variations.length);
    setIdx(next);
  };

  const secondary = useMemo(
    () => (ex.secondaryMuscles || []).slice(0, 3),
    [ex.secondaryMuscles]
  );

  return (
    <div className="ex-card">
      {onToggleFav && (
        <button
          className={"fav-btn" + (fav ? " on" : "")}
          onClick={() => onToggleFav(ex.name)}
          title={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
        >
          <Icon name="star" size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      )}

      {/* Full-width cover: static poster; tap "View" for the animated demo */}
      <button className="ex-cover" onClick={() => open(ex)} aria-label={`View ${ex.name}`}>
        <CoverImage name={ex.name} group={group.group} muscle={ex.muscleGroup} />
        <div className="cover-shade" />
        {multi && <span className="cover-count">{variations.length} variations</span>}
        <span className="view-btn"><Icon name="play" size={14} /> View</span>
      </button>

      <div className="ex-body">
        <div style={{ minWidth: 0 }}>
          <h3>{ex.name}</h3>
          {multi && <div className="group-label">{group.group}</div>}
        </div>

        <div className="tags">
          <span className="mtag primary">{ex.muscleGroup}</span>
          {secondary.map((m) => (
            <span className="mtag" key={m}>{m}</span>
          ))}
        </div>

        <div className="meta">
          <span className={difficultyClass(ex.difficulty)}>{ex.difficulty || "Intermediate"}</span>
          <span className="badge equip"><Icon name={equipIcon(ex.equipment)} size={13} /> {ex.equipment}</span>
        </div>

        {multi && (
          <div className="var-switch">
            <select value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
              {variations.map((v, i) => (
                <option key={v._id || v.name} value={i}>{v.name}</option>
              ))}
            </select>
            <button className="btn dice" onClick={randomize} title="Randomize variation">
              <Icon name="dice" size={18} />
            </button>
          </div>
        )}

        {(onAdd || (onDelete && ex.isCustom)) && (
          <div className="footer">
            {onAdd && (
              <button className="btn primary sm block" onClick={() => onAdd(ex)}>
                <Icon name="plus" size={16} /> Add to workout
              </button>
            )}
            {onDelete && ex.isCustom && (
              <button className="btn danger sm icon" onClick={() => onDelete(ex)} title="Delete">
                <Icon name="trash" size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
