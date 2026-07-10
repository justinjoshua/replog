import { useEffect, useRef, useState } from "react";
import { THEMES } from "../hooks/useTheme.js";
import Icon from "./Icon.jsx";

/**
 * Accent theme switcher: a palette button that opens a grid of colour swatches.
 * `align` controls which way the menu opens ("up" for the desktop sidebar,
 * "down" for the mobile top bar).
 */
export default function ThemePicker({ themeKey, onPick, align = "up", compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="theme-picker" ref={ref}>
      <button
        className={"btn ghost" + (compact ? " icon sm" : "")}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Change accent colour"
        style={compact ? undefined : { justifyContent: "flex-start", width: "100%", gap: 10 }}
      >
        <Icon name="palette" size={18} />
        {!compact && "Theme"}
      </button>

      {open && (
        <div className={"theme-menu " + align} role="menu">
          {THEMES.map((t) => (
            <button
              key={t.key}
              className={"swatch" + (themeKey === t.key ? " active" : "")}
              style={{ background: t.swatch || t.accent }}
              title={t.name}
              aria-label={t.name}
              onClick={() => { onPick(t.key); setOpen(false); }}
            >
              {themeKey === t.key && <Icon name="check" size={14} color="#fff" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
