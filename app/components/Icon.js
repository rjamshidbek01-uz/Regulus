// Small inline icon set (no external assets; works with the strict CSP).
const FILL = {
  heart: "M12 21s-7.5-4.6-9.6-9.3C.9 8.2 2.9 4.5 6.6 4.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.7 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z",
  flame: "M12 2c1 3.5 5.5 6 5.5 11.5a5.5 5.5 0 0 1-11 0c0-2 .8-3.6 2-4.8.3 1.6 1 2.6 2 3.1C10 8.5 10.5 5 12 2z",
  bolt: "M13.5 2 4.5 13.5h6L9.5 22l10-12.5H13z",
  star: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z",
  play: "M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z",
  lock: "M7 10V7.5a5 5 0 0 1 10 0V10h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm2.5 0h5V7.5a2.5 2.5 0 0 0-5 0z",
};
const LINE = {
  home: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z",
  repeat: "M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5",
  book: "M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.500 1.500 2-1.500 5-2 8.500-1.500V5C17 4.5 14 5 12 6.5zM12 6.5v13",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3.500 3.500 0 0 0 3.800 3.500M16 6h3.500a3.500 3.500 0 0 1-3.800 3.500M12 13v4M8.500 20h7M10 17h4",
  chat: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4.500 3.500V17H6a2 2 0 0 1-2-2z",
  check: "M5 12.500l4.500 4.500L19 7.500",
  x: "M6 6l12 12M18 6L6 18",
  sound: "M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 9a4.500 4.500 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11",
  mute: "M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM16 9.500l5 5M21 9.500l-5 5",
  ear: "M7 10a5 5 0 0 1 10 0c0 3-2.500 3.500-3 6a3 3 0 0 1-5.500 1.500M10 10.500a2 2 0 0 1 4 0",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500L18 18M18 6l-2.500 2.500M8.500 15.500L6 18",
};
export default function Icon({ n, size }) {
  const s = size ? { width: size, height: size } : undefined;
  if (FILL[n]) return <svg viewBox="0 0 24 24" style={s} fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d={FILL[n]} /></svg>;
  return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={LINE[n]} /></svg>;
}
