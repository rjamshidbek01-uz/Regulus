"use client";
import { useEffect, useRef, useState } from "react";

// Pointer-driven 3D tilt: exposes --tx / --ty (-1..1) to CSS. Off for touch and reduced motion.
export function Tilt({ className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover:hover)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      el.style.setProperty("--tx", x.toFixed(3)); el.style.setProperty("--ty", y.toFixed(3));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className={`tilt ${className}`}>{children}</div>;
}

const COLORS = ["#ffbf2f", "#17c3b2", "#ff5470", "#5468ff", "#9b6bff", "#fff"];
export function Confetti({ n = 44 }) {
  const [bits, setBits] = useState([]);
  useEffect(() => {
    setBits(Array.from({ length: n }, (_, i) => {
      const a = Math.random() * Math.PI * 2, d = 140 + Math.random() * 300;
      return { "--x": `${Math.cos(a) * d}px`, "--y": `${Math.sin(a) * d * 0.8 + 220}px`, "--rt": `${Math.random() * 900 - 450}deg`, "--c": COLORS[i % COLORS.length], "--dl": `${Math.random() * 180}ms` };
    }));
  }, [n]);
  return <div className="confetti" aria-hidden="true">{bits.map((s, i) => <i key={i} style={s} />)}</div>;
}

// Tiny synthesized sound effects (no audio files). Muted state is remembered.
let ctx;
export const soundOff = () => { try { return localStorage.getItem("mute") === "1"; } catch { return false; } };
export const setSoundOff = (v) => { try { localStorage.setItem("mute", v ? "1" : "0"); } catch {} };
export function sfx(kind) {
  if (soundOff()) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const notes = { good: [[660, 0], [880, 0.09]], bad: [[220, 0], [165, 0.12]], win: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]], tap: [[520, 0]] }[kind] || [];
    for (const [f, at] of notes) {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + at;
      o.type = kind === "bad" ? "triangle" : "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(kind === "tap" ? 0.05 : 0.16, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.22);
    }
  } catch {}
}
