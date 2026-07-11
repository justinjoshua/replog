import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon, { equipIcon } from "./Icon.jsx";
import { api } from "../api.js";
import { exerciseGifs } from "../lib/exerciseGifs.js";
import { exerciseImages } from "../lib/exerciseImages.js";
import { exerciseInfo } from "../lib/exerciseInfo.js";

const ViewerCtx = createContext({ open: () => {} });
export const useExerciseViewer = () => useContext(ViewerCtx);

export function ExerciseViewerProvider({ aiOn = false, children }) {
  const [ex, setEx] = useState(null);
  const [closing, setClosing] = useState(false);

  const open = useCallback((exercise) => { setClosing(false); setEx(exercise); }, []);
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setEx(null); setClosing(false); }, 260);
  }, []);

  return (
    <ViewerCtx.Provider value={{ open }}>
      {children}
      {ex && <ViewerPanel ex={ex} aiOn={aiOn} closing={closing} onClose={close} />}
    </ViewerCtx.Provider>
  );
}

function defaultSetsReps(muscle) {
  return ["Biceps", "Triceps", "Core"].includes(muscle)
    ? "3 sets × 12–15 reps"
    : "3–4 sets × 8–12 reps";
}

function ViewerPanel({ ex, aiOn, closing, onClose }) {
  const gif = exerciseGifs[ex.name];
  const poster = gif ? gif.replace(/\.gif$/, ".jpg") : null;
  const frames = exerciseImages[ex.name];
  const two = Array.isArray(frames) && frames.length > 1;   // smooth crossfade demo
  const still = (Array.isArray(frames) ? frames[0] : frames) || poster;
  const info = exerciseInfo[ex.name];

  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [guide, setGuide] = useState(null);
  const [guideLoading, setGuideLoading] = useState(false);

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  // AI tips + common mistakes (cached in localStorage per exercise).
  useEffect(() => {
    if (!aiOn) return;
    const key = `replog.guide.${ex.name}`;
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null");
      if (cached) { setGuide(cached); return; }
    } catch { /* ignore */ }
    let alive = true;
    setGuide(null);
    setGuideLoading(true);
    api.aiExerciseGuide({ name: ex.name, muscle: ex.muscleGroup, equipment: ex.equipment })
      .then((g) => { if (!alive) return; setGuide(g); try { localStorage.setItem(key, JSON.stringify(g)); } catch { /* quota */ } })
      .catch(() => {})
      .finally(() => alive && setGuideLoading(false));
    return () => { alive = false; };
  }, [ex.name, ex.muscleGroup, ex.equipment, aiOn]);

  // Swipe-down to dismiss (mobile bottom sheet).
  const sheetRef = useRef(null);
  const drag = useRef({ y: 0, active: false });
  const onTouchStart = (e) => { drag.current = { y: e.touches[0].clientY, active: true }; };
  const onTouchMove = (e) => {
    if (!drag.current.active || !sheetRef.current) return;
    const dy = e.touches[0].clientY - drag.current.y;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = (e) => {
    if (!sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - drag.current.y;
    sheetRef.current.style.transform = "";
    drag.current.active = false;
    if (dy > 110) onClose();
  };

  const setsReps = guide?.setsReps || defaultSetsReps(ex.muscleGroup);

  return (
    <div className={"viewer-root" + (closing ? " closing" : "")}>
      <div className="viewer-backdrop" onClick={onClose} />
      <aside
        className="viewer-panel"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={ex.name}
      >
        <div className="viewer-grab" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <span className="grab-bar" />
        </div>
        <button className="viewer-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} />
        </button>

        <div className="viewer-scroll">
          {/* Media — smooth start↔end demonstration (no choppy GIF) */}
          <div className="viewer-media">
            {two ? (
              <>
                {!mediaLoaded && <div className="viewer-media-skel skeleton" />}
                <img
                  className={"viewer-gif" + (mediaLoaded ? " loaded" : "")}
                  src={frames[0]}
                  alt={ex.name}
                  onLoad={() => setMediaLoaded(true)}
                />
                <img className="viewer-anim" src={frames[1]} alt="" aria-hidden="true" />
              </>
            ) : still ? (
              <>
                {!mediaLoaded && <div className="viewer-media-skel skeleton" />}
                <img
                  className={"viewer-gif" + (mediaLoaded ? " loaded" : "")}
                  src={still}
                  alt={ex.name}
                  onLoad={() => setMediaLoaded(true)}
                />
              </>
            ) : (
              <div className="viewer-media-empty"><Icon name="dumbbell" size={40} /></div>
            )}
          </div>

          {/* Title + meta */}
          <h2 className="viewer-title">{ex.name}</h2>
          {ex.group && ex.group !== ex.name && <div className="faint" style={{ marginTop: 2 }}>{ex.group}</div>}

          <div className="viewer-tags">
            <span className={"badge " + (ex.difficulty || "Intermediate").toLowerCase()}>{ex.difficulty || "Intermediate"}</span>
            <span className="badge equip"><Icon name={equipIcon(ex.equipment)} size={13} /> {ex.equipment}</span>
            <span className="mtag primary">{ex.muscleGroup}</span>
            {(ex.secondaryMuscles || []).map((m) => <span className="mtag" key={m}>{m}</span>)}
          </div>

          <div className="viewer-recos">
            <Icon name="list" size={16} /> Recommended: <strong>{setsReps}</strong>
          </div>

          {/* Instructions */}
          {info?.instructions?.length > 0 && (
            <Section title="How to perform" icon="check">
              <ol className="viewer-steps">
                {info.instructions.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Section>
          )}

          {/* AI: tips + mistakes */}
          {aiOn && (
            <>
              <Section title="Form tips" icon="sparkles">
                {guideLoading && !guide ? <GuideSkeleton /> :
                  guide?.tips?.length ? <ul className="viewer-list good">{guide.tips.map((t, i) => <li key={i}>{t}</li>)}</ul> :
                  <p className="faint">No tips available.</p>}
              </Section>
              <Section title="Common mistakes" icon="close">
                {guideLoading && !guide ? <GuideSkeleton /> :
                  guide?.mistakes?.length ? <ul className="viewer-list bad">{guide.mistakes.map((t, i) => <li key={i}>{t}</li>)}</ul> :
                  <p className="faint">No data.</p>}
              </Section>
            </>
          )}
          {!aiOn && (
            <p className="faint" style={{ marginTop: 20, fontSize: "0.85rem" }}>
              Enable AI (add a Gemini key) for personalized form tips and common mistakes.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="viewer-section">
      <h3 className="viewer-section-title"><Icon name={icon} size={16} /> {title}</h3>
      {children}
    </div>
  );
}

function GuideSkeleton() {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {[90, 75, 82].map((w, i) => <div key={i} className="skeleton" style={{ height: 14, width: `${w}%` }} />)}
    </div>
  );
}
