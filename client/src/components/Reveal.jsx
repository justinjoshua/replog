import { useEffect, useRef, useState } from "react";

/** Fades/slides its children in when scrolled into view (once). */
export default function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={"reveal " + (seen ? "revealed " : "") + className} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
