import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";
import { LOGIN_BG } from "../lib/images.js";

export default function Login({ initialMode = "login", onBack }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="auth-screen has-photo"
      style={{ backgroundImage: `linear-gradient(rgba(8,8,10,0.72), rgba(8,8,10,0.88)), url(${LOGIN_BG})` }}
    >
      <div className="auth-card">
        {onBack && (
          <button className="link-btn auth-back" onClick={onBack}>
            <Icon name="chevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> Back
          </button>
        )}
        <div className="auth-brand">
          <span className="logo"><Logo size={24} /></span>
          <span>RepLog</span>
        </div>
        <h1 className="auth-title">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-sub">
          {isRegister ? "Start tracking your training in seconds." : "Sign in to your training log."}
        </p>

        <form onSubmit={submit}>
          {isRegister && (
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={set("name")} placeholder="Alex" autoComplete="name" required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete={isRegister ? "new-password" : "current-password"} required />
          </div>

          {error && <div className="auth-error"><Icon name="close" size={15} /> {error}</div>}

          <button className="btn primary block gym" disabled={busy} style={{ marginTop: 6 }}>
            {busy ? <><span className="spinner" /> Please wait…</>
              : <><Icon name="dumbbell" size={17} /> {isRegister ? "Start training" : "Let's train"}</>}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? "Already have an account?" : "New to RepLog?"}{" "}
          <button className="link-btn" onClick={() => { setMode(isRegister ? "login" : "register"); setError(""); }}>
            {isRegister ? "Sign in" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
