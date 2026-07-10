import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
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
    <div className="auth-screen">
      <div className="auth-card">
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

          <button className="btn primary block" disabled={busy} style={{ marginTop: 6 }}>
            {busy ? <><span className="spinner" /> Please wait…</> : (isRegister ? "Create account" : "Sign in")}
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
