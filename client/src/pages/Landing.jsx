import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";
import Reveal from "../components/Reveal.jsx";
import { LANDING_HERO, LANDING_SHOTS } from "../lib/images.js";

const FEATURES = [
  {
    icon: "log", title: "Log every set in seconds",
    desc: "Build a session fast — reps, weight, RPE and notes — with autocomplete and one-tap quick-add from your favorites.",
    points: ["Per-exercise rest timer", "Favorites & recently-used", "Auto-saved to your account"],
  },
  {
    icon: "dumbbell", title: "155 exercises, demonstrated",
    desc: "Every movement and its variations, each with an animated demo, target muscles, difficulty and step-by-step instructions.",
    points: ["Animated exercise viewer", "Switch or randomize variations", "AI form tips & common mistakes"],
  },
  {
    icon: "programs", title: "Follow a proven program",
    desc: "12 professionally-structured splits from beginner to advanced — full weekly schedules with sets, reps and rest.",
    points: ["Full Body · Upper/Lower · PPL · Arnold…", "Day-by-day exercise plans", "Start a day in one tap"],
  },
  {
    icon: "sparkles", title: "Your AI training partner",
    desc: "Powered by Google Gemini — just describe your workout and it logs it, or ask it to design a session and coach your progress.",
    points: ["Natural-language logging", "Workout generator", "Progress coach & analysis"],
  },
  {
    icon: "trending", title: "See real progress",
    desc: "Volume charts, estimated-1RM personal records, streaks and weekly goals — your training, measured.",
    points: ["30-day volume chart", "Personal records", "Streaks & weekly goal ring"],
  },
  {
    icon: "palette", title: "Built for your phone",
    desc: "A premium, mobile-first dark experience with a live theme switcher — from electric accents to shiny chrome.",
    points: ["9 accent themes + 6 metallics", "One-handed navigation", "Fast, smooth, responsive"],
  },
];

export default function Landing({ onAuth }) {
  return (
    <div className="landing">
      <header className="lp-nav">
        <div className="brand">
          <span className="logo"><Logo size={20} /></span>
          <span>RepLog</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm" onClick={() => onAuth("login")}>Sign in</button>
          <button className="btn primary sm gym" onClick={() => onAuth("register")}>Start training</button>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero" style={{ backgroundImage: `url(${LANDING_HERO})` }}>
        <div className="lp-hero-inner">
          <span className="lp-eyebrow">MERN · AI · Built for lifters</span>
          <h1>Train smarter.<br />Track everything.</h1>
          <p>The all-in-one workout logger with animated exercise demos, ready-made programs and an AI coach — in a premium dark app that lives on your phone.</p>
          <div className="row" style={{ gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn primary gym" onClick={() => onAuth("register")}>
              <Icon name="dumbbell" size={18} /> Start lifting — free
            </button>
            <button className="btn light gym" onClick={() => onAuth("login")}>Member sign in</button>
          </div>
          <div className="lp-stats">
            <div><b>155</b><span>Exercises</span></div>
            <div><b>12</b><span>Programs</span></div>
            <div><b>AI</b><span>Coaching</span></div>
          </div>
          <div className="lp-scroll-hint"><Icon name="chevronDown" size={22} /></div>
        </div>
      </section>

      {/* Feature sections — one per scroll */}
      {FEATURES.map((f, i) => (
        <section className={"lp-feature" + (i % 2 ? " alt" : "")} key={f.title}>
          <Reveal className={"lp-feature-inner" + (i % 2 ? " reverse" : "")}>
            <div className="lp-feature-media">
              <img src={LANDING_SHOTS[i]} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="lp-feature-text">
              <span className="lp-feature-icon"><Icon name={f.icon} size={22} /></span>
              <h2>{f.title}</h2>
              <p>{f.desc}</p>
              <ul>
                {f.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </Reveal>
        </section>
      ))}

      {/* Final CTA */}
      <section className="lp-cta">
        <Reveal>
          <h2>Ready to start training?</h2>
          <p className="muted" style={{ maxWidth: 480, margin: "10px auto 22px" }}>
            Create your free account and log your first session in under a minute.
          </p>
          <div className="row" style={{ gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn primary gym" onClick={() => onAuth("register")}>
              <Icon name="dumbbell" size={18} /> Start your journey
            </button>
            <button className="btn" onClick={() => onAuth("login")}>Sign in</button>
          </div>
        </Reveal>
      </section>

      <footer className="lp-footer">
        RepLog — built with the MERN stack & Google Gemini.
      </footer>
    </div>
  );
}
