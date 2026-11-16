// Tiny safe renderer: *italic* and **bold** (no HTML injection, React escapes everything).
export default function Md({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return <>{parts.map((p, i) => (p.length > 4 && p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p.length > 2 && p.startsWith("*") && p.endsWith("*") ? <i key={i}>{p.slice(1, -1)}</i> : p))}</>;
}
