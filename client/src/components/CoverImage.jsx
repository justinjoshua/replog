import { useEffect, useState } from "react";
import ExerciseArt from "./ExerciseArt.jsx";
import { exerciseGifs } from "../lib/exerciseGifs.js";
import { exerciseImages } from "../lib/exerciseImages.js";

/**
 * Static exercise cover for cards — prefers a real photograph (free-exercise-db),
 * falling back to the ExerciseDB poster frame, then line-art. Static only; the
 * animated demo lives in the viewer panel so the grid stays fast.
 */
export default function CoverImage({ name, group, muscle }) {
  const gif = exerciseGifs[name];
  const poster = gif ? gif.replace(/\.gif$/, ".jpg") : null;
  const frames = exerciseImages[name];
  const photo = Array.isArray(frames) ? frames[0] : frames;
  const src = photo || poster || null;

  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setFailed(false); setLoaded(false); }, [src]);

  if (!src || failed) return <ExerciseArt group={group} muscle={muscle} size={72} />;

  return (
    <>
      {!loaded && <div className="cover-skeleton skeleton" />}
      <img
        className={"cover-img" + (loaded ? " loaded" : "")}
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
