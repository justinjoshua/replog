// Minimal line-art of a figure performing each movement pattern, drawn in the
// current colour so it inherits the card/theme accent. Mapped from the exercise
// group (falling back to muscle group) so a bench card shows a press, a squat
// card shows a squat, etc.

export function artKey(group = "", muscle = "") {
  const g = group.toLowerCase();
  if (/deadlift|hinge|hip thrust|good morning|romanian|rdl|pull-through/.test(g)) return "hinge";
  if (/squat|lunge|leg press|calf|quad|leg extension|step|adduction|abduction/.test(g)) return "squat";
  if (/curl/.test(g)) return "curl";
  if (/triceps|pushdown|skull/.test(g)) return "triceps";
  if (/row|pulldown|pull-up|chin-up|shrug|back extension|vertical pull/.test(g)) return "pull";
  if (/press|bench|fly|push-up|overhead|lateral|rear|upright|dip/.test(g)) return "press";
  if (/core/.test(g)) return "core";
  if (/cardio/.test(g)) return "cardio";

  switch (muscle) {
    case "Legs":
    case "Glutes": return "squat";
    case "Back": return "pull";
    case "Biceps": return "curl";
    case "Triceps": return "triceps";
    case "Core": return "core";
    case "Cardio": return "cardio";
    case "Chest":
    case "Shoulders": return "press";
    default: return "barbell";
  }
}

const Head = ({ cx, cy, r = 3 }) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
const Plate = (props) => <path {...props} strokeWidth={3.2} />;

const ART = {
  // Overhead press
  press: (
    <>
      <Head cx={24} cy={12} />
      <path d="M24 15 V28" />
      <path d="M24 28 L19 40" /><path d="M24 28 L29 40" />
      <path d="M24 17 L18 11" /><path d="M24 17 L30 11" />
      <path d="M11 9 H37" />
      <Plate d="M12 6 V12" /><Plate d="M36 6 V12" />
    </>
  ),
  // Lat pulldown
  pull: (
    <>
      <Head cx={24} cy={16} />
      <path d="M24 19 V29" />
      <path d="M24 29 L20 40" /><path d="M24 29 L28 40" />
      <path d="M24 20 L19 13" /><path d="M24 20 L29 13" />
      <path d="M14 10 H34" />
      <Plate d="M15 7 V13" /><Plate d="M33 7 V13" />
    </>
  ),
  // Back squat
  squat: (
    <>
      <Head cx={24} cy={10} />
      <path d="M14 15 H34" />
      <Plate d="M15 12 V18" /><Plate d="M33 12 V18" />
      <path d="M24 16 V25" />
      <path d="M24 25 L18 30 V40" /><path d="M24 25 L30 30 V40" />
    </>
  ),
  // Romanian deadlift / hinge
  hinge: (
    <>
      <Head cx={14} cy={14} />
      <path d="M16 16 L28 23" />
      <path d="M28 23 L28 34" />
      <path d="M28 23 L30 40" /><path d="M28 23 L25 39" />
      <path d="M22 35 H38" />
      <Plate d="M23 32 V38" /><Plate d="M37 32 V38" />
    </>
  ),
  // Dumbbell curl
  curl: (
    <>
      <Head cx={24} cy={9} />
      <path d="M24 12 V27" />
      <path d="M24 27 L20 40" /><path d="M24 27 L28 40" />
      <path d="M24 15 L21 25" />
      <path d="M21 25 L27 18" />
      <path d="M24.5 16.2 L29.5 19.8" strokeWidth={3} />
    </>
  ),
  // Cable triceps pushdown
  triceps: (
    <>
      <circle cx={25} cy={7} r={2} fill="currentColor" stroke="none" />
      <path d="M25 8 V30" />
      <path d="M21 30 H29" />
      <Head cx={18} cy={12} />
      <path d="M18 15 V28" />
      <path d="M18 28 L15 40" /><path d="M18 28 L22 40" />
      <path d="M18 17 L23 22" /><path d="M23 22 L25 30" />
    </>
  ),
  // Forearm plank
  core: (
    <>
      <Head cx={35} cy={30} />
      <path d="M13 34 H18" />
      <path d="M17 34 L18 30 L33 31" />
      <path d="M33 31 L34 40" />
    </>
  ),
  // Running
  cardio: (
    <>
      <Head cx={28} cy={10} />
      <path d="M28 13 L23 23" />
      <path d="M25 17 L30 20" /><path d="M25 17 L20 14" />
      <path d="M23 23 L29 31" /><path d="M23 23 L17 30" />
    </>
  ),
  // Plain barbell
  barbell: (
    <>
      <path d="M9 24 H39" />
      <path d="M15 20 V28" /><path d="M33 20 V28" />
      <Plate d="M11 17 V31" /><Plate d="M37 17 V31" />
    </>
  ),
};

export default function ExerciseArt({ group, muscle, size = 64 }) {
  const key = artKey(group || "", muscle || "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ART[key] || ART.barbell}
    </svg>
  );
}
