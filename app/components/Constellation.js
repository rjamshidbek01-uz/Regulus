// A chapter drawn as a constellation: three lesson stars and a bigger "test" star, joined by lines
// that light up as lessons are finished. Each star is also a link.
const SHAPES = [
  [[44, 96], [124, 44], [206, 86], [282, 38]],
  [[44, 44], [122, 98], [204, 56], [282, 100]],
  [[44, 70], [124, 108], [204, 40], [282, 82]],
];
const star = (cx, cy, r) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    d += `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return d + "Z";
};
export default function Constellation({ n, nodes }) {
  const P = SHAPES[(n - 1) % SHAPES.length];
  return (
    <svg className="const" viewBox="0 0 326 150" role="group" aria-label="Bölim yulduz turkumi">
      {P.slice(1).map(([x, y], i) => {
        const [px, py] = P[i];
        const lit = nodes[i].state === "done" && nodes[i + 1].state !== "locked";
        return <line key={i} x1={px} y1={py} x2={x} y2={y} className={lit ? "lit" : ""} />;
      })}
      {P.map(([x, y], i) => {
        const nd = nodes[i], big = i === 3, r = big ? 21 : 16;
        const body = (
          <g className={`cs ${nd.state} ${big ? "test" : ""}`}>
            {nd.state !== "locked" && <circle cx={x} cy={y} r={r + 9} className="halo" />}
            <path d={star(x, y, r)} />
            <text x={x} y={y + r + 18} textAnchor="middle">{nd.label}</text>
          </g>
        );
        return nd.href && nd.state !== "locked" ? <a key={i} href={nd.href} aria-label={nd.aria}>{body}</a> : <g key={i} aria-label={nd.aria}>{body}</g>;
      })}
    </svg>
  );
}
