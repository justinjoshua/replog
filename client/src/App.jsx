import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { ToastProvider } from "./toast.jsx";
import { api } from "./api.js";
import Icon from "./components/Icon.jsx";
import Logo from "./components/Logo.jsx";
import ThemePicker from "./components/ThemePicker.jsx";
import { ExerciseViewerProvider } from "./components/ExerciseViewer.jsx";
import { useTheme } from "./hooks/useTheme.js";

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

export default function App() {
  const [aiOn, setAiOn] = useState(false);
  const location = useLocation();
  const { themeKey, setThemeKey } = useTheme();

  useEffect(() => {
    api.aiStatus().then((s) => setAiOn(s.enabled)).catch(() => {});
  }, []);

  return (
    <ToastProvider>
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
          <ThemePicker themeKey={themeKey} onPick={setThemeKey} align="up" />
          <div className="ai-badge">
            <span className={"dot" + (aiOn ? " on" : "")} />
            {aiOn ? "AI features on" : "AI off — add key"}
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="topbar">
          <div className="brand">
            <span className="logo"><Logo size={20} /></span>
            <span>RepLog</span>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <ThemePicker themeKey={themeKey} onPick={setThemeKey} align="down" compact />
            <span className={"dot" + (aiOn ? " on" : "")} title={aiOn ? "AI on" : "AI off"} />
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
    </ToastProvider>
  );
}
