import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { ToastProvider } from "./toast.jsx";
import { api } from "./api.js";
import Icon from "./components/Icon.jsx";
import Logo from "./components/Logo.jsx";
import ThemePicker from "./components/ThemePicker.jsx";
import { ExerciseViewerProvider } from "./components/ExerciseViewer.jsx";
import { useTheme } from "./hooks/useTheme.js";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LogWorkout from "./pages/LogWorkout.jsx";
import History from "./pages/History.jsx";
import Exercises from "./pages/Exercises.jsx";
import Coach from "./pages/Coach.jsx";
import Programs from "./pages/Programs.jsx";
import ProgramDetail from "./pages/ProgramDetail.jsx";

const NAV = [
  { to: "/", label: "Home", ico: "dashboard", end: true },
  { to: "/programs", label: "Programs", ico: "programs" },
  { to: "/log", label: "Log", ico: "log" },
  { to: "/history", label: "History", ico: "history" },
  { to: "/exercises", label: "Exercises", ico: "exercises" },
  { to: "/coach", label: "Coach", ico: "coach" },
];

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </AuthProvider>
  );
}

function Shell() {
  const { user, loading, logout } = useAuth();
  const { themeKey, setThemeKey } = useTheme(); // theme applies on the login screen too
  const [aiOn, setAiOn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user) api.aiStatus().then((s) => setAiOn(s.enabled)).catch(() => {});
  }, [user]);

  if (loading)
    return (
      <div className="auth-screen">
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );

  if (!user) return <Login />;

  return (
    <ExerciseViewerProvider aiOn={aiOn}>
      <div className="app">
        {/* Desktop side navigation */}
        <aside className="sidebar">
          <div className="brand">
            <span className="logo"><Logo size={22} /></span>
            <span>RepLog</span>
          </div>
          <div className="nav-section">Menu</div>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              <Icon name={n.ico} size={19} />
              {n.label}
            </NavLink>
          ))}
          <div className="spacer" />
          <div className="ai-badge">
            <span className={"dot" + (aiOn ? " on" : "")} />
            {aiOn ? "AI features on" : "AI off — add key"}
          </div>
          <div className="row" style={{ gap: 6, marginTop: 4 }}>
            <ThemePicker themeKey={themeKey} onPick={setThemeKey} align="up" compact />
            <div className="user-row">
              <span className="user-avatar">{initials(user.name)}</span>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <button className="btn ghost icon sm" onClick={logout} title="Sign out">
                <Icon name="logout" size={17} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="topbar">
          <div className="brand">
            <span className="logo"><Logo size={20} /></span>
            <span>RepLog</span>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <ThemePicker themeKey={themeKey} onPick={setThemeKey} align="down" compact />
            <button className="btn ghost icon sm" onClick={logout} title="Sign out">
              <Icon name="logout" size={18} />
            </button>
          </div>
        </header>

        <main className="main">
          <div className="page" key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/log" element={<LogWorkout aiOn={aiOn} />} />
              <Route path="/history" element={<History />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/coach" element={<Coach aiOn={aiOn} />} />
            </Routes>
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="bottom-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => "tab" + (isActive ? " active" : "")}
            >
              <span className="tab-ico"><Icon name={n.ico} size={21} /></span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </ExerciseViewerProvider>
  );
}
