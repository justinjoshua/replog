import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// Default dark surface palette. Metallic themes can override it (Onyx → gray).
const DEFAULT_SURFACE = {
  bg: "#0b0b0b",
  bg2: "#121212",
  card: "#181818",
  card2: "#1f1f1f",
  border: "#2a2a2a",
  border2: "#383838",
};

// Shiny metallic themes: a vertical chrome gradient + a brighter hover gradient.
// `text` is the button label colour; `accent` tints rings/chips/nav/chart.
const METALS = [
  {
    key: "silver", name: "Silver", accent: "#c8ccd2", hover: "#e2e6ec", metal: true, text: "#16181d",
    grad: "linear-gradient(180deg,#f7f9fc 0%,#d3d8e0 46%,#b3b9c5 54%,#e2e6ec 100%)",
    gradHover: "linear-gradient(180deg,#ffffff 0%,#dbe0e8 46%,#bcc2ce 54%,#eef1f5 100%)",
    swatch: "linear-gradient(135deg,#f5f7fa,#cfd4dd 45%,#aeb4c0 55%,#eef1f5)",
  },
  {
    key: "gold", name: "Gold", accent: "#e3c04a", hover: "#f0d271", metal: true, text: "#16181d",
    grad: "linear-gradient(180deg,#fbe9a6 0%,#e6c15c 46%,#c39a34 54%,#f2d987 100%)",
    gradHover: "linear-gradient(180deg,#fff3c4 0%,#f0cd72 46%,#cfa63b 54%,#f8e3a0 100%)",
    swatch: "linear-gradient(135deg,#fbe9a6,#e6c15c 45%,#c39a34 55%,#f2d987)",
  },
  {
    key: "rosegold", name: "Rose Gold", accent: "#e6b8a2", hover: "#f2d0c2", metal: true, text: "#16181d",
    grad: "linear-gradient(180deg,#f9e2d8 0%,#e6b8a2 46%,#cf9884 54%,#f1ccbd 100%)",
    gradHover: "linear-gradient(180deg,#fdeee7 0%,#eec4b2 46%,#daa693 54%,#f6d8cb 100%)",
    swatch: "linear-gradient(135deg,#f9e2d8,#e6b8a2 45%,#cf9884 55%,#f1ccbd)",
  },
  {
    key: "copper", name: "Copper", accent: "#cd7f4a", hover: "#e09a68", metal: true, text: "#16181d",
    grad: "linear-gradient(180deg,#f0c19a 0%,#cd7f4a 46%,#a8632f 54%,#e0a877 100%)",
    gradHover: "linear-gradient(180deg,#f7d3b3 0%,#d98e59 46%,#b87038 54%,#eab98a 100%)",
    swatch: "linear-gradient(135deg,#f0c19a,#cd7f4a 45%,#a8632f 55%,#e0a877)",
  },
  {
    key: "gunmetal", name: "Gunmetal", accent: "#9aa4b0", hover: "#b6bec8", metal: true, text: "#f5f7fa",
    grad: "linear-gradient(180deg,#6b7280 0%,#3f4652 46%,#2a2f38 54%,#565d69 100%)",
    gradHover: "linear-gradient(180deg,#7c8494 0%,#49515f 46%,#333a45 54%,#646c7a 100%)",
    swatch: "linear-gradient(135deg,#8b93a1,#3f4652 55%,#2a2f38)",
  },
  {
    key: "onyx", name: "Onyx", accent: "#c9c9d1", hover: "#e2e2e8", metal: true, text: "#f5f7fa",
    grad: "linear-gradient(180deg,#4a4a52 0%,#1e1e22 46%,#0b0b0d 54%,#3a3a42 100%)",
    gradHover: "linear-gradient(180deg,#5c5c66 0%,#2a2a30 46%,#141416 54%,#4a4a54 100%)",
    swatch: "linear-gradient(135deg,#4a4a52,#1e1e22 55%,#0b0b0d)",
    // Glossy black needs a lighter stage — turn the whole page gray.
    surface: {
      bg: "#26262b", bg2: "#2e2e34", card: "#35353c",
      card2: "#3e3e46", border: "#4a4a53", border2: "#5a5a64",
    },
  },
];

// Flat, solid-colour themes.
const SOLIDS = [
  { key: "purple", name: "Purple", accent: "#8b5cf6", hover: "#7c4deb" },
  { key: "blue", name: "Blue", accent: "#3b82f6", hover: "#2f74e6" },
  { key: "emerald", name: "Emerald", accent: "#10b981", hover: "#0ea472" },
  { key: "cyan", name: "Cyan", accent: "#06b6d4", hover: "#0aa2bd" },
  { key: "lime", name: "Lime", accent: "#84cc16", hover: "#74b512" },
  { key: "amber", name: "Amber", accent: "#f59e0b", hover: "#e08e08" },
  { key: "orange", name: "Orange", accent: "#f97316", hover: "#ea6a0f" },
  { key: "pink", name: "Pink", accent: "#ec4899", hover: "#db3d8b" },
  { key: "red", name: "Red", accent: "#ef4444", hover: "#e23b3b" },
];

export const THEMES = [...METALS, ...SOLIDS];

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export function applyTheme(t) {
  const el = document.documentElement;
  const r = el.style;

  r.setProperty("--accent", t.accent);
  r.setProperty("--accent-hover", t.hover);
  r.setProperty("--accent-weak", hexA(t.accent, t.metal ? 0.16 : 0.12));
  r.setProperty("--accent-ring", hexA(t.accent, 0.35));

  // Surface palette (default, or a theme override like Onyx's gray).
  const s = t.surface || DEFAULT_SURFACE;
  r.setProperty("--bg", s.bg);
  r.setProperty("--bg-2", s.bg2);
  r.setProperty("--card", s.card);
  r.setProperty("--card-2", s.card2);
  r.setProperty("--border", s.border);
  r.setProperty("--border-2", s.border2);

  // Metal chrome variables (consumed by the [data-metal] CSS block).
  if (t.metal) {
    el.dataset.metal = t.key;
    const lightText = t.text === "#f5f7fa";
    r.setProperty("--metal-grad", t.grad);
    r.setProperty("--metal-grad-hover", t.gradHover || t.grad);
    r.setProperty("--metal-text", t.text);
    r.setProperty("--metal-tsh", lightText ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)");
    r.setProperty("--metal-border", lightText ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.7)");
  } else {
    delete el.dataset.metal;
  }
}

/** Persisted accent theme. Applies to :root and survives reloads. */
export function useTheme() {
  const [key, setKey] = useLocalStorage("replog.theme", "silver");
  const theme = THEMES.find((t) => t.key === key) || THEMES[0];

  useEffect(() => { applyTheme(theme); }, [theme]);

  return { theme, themeKey: theme.key, setThemeKey: setKey };
}
