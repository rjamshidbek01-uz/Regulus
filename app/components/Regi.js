// Regi — the Regulus lion cub. "Regulus" means "little king" and is the heart star of Leo,
// so the mascot is a small lion with a crown and a star-tipped tail.
// Pure SVG (works in server and client components); motion lives in globals.css.
// moods: happy | wave | cheer | sad | think | sleep | shy (paws over eyes)
const INK = "#3b2440";

function Eyes({ mood }) {
  if (mood === "cheer") return (
    <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
      <path d="M73 91 Q82 80 91 91" /><path d="M109 91 Q118 80 127 91" />
    </g>
  );
  if (mood === "sleep") return (
    <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
      <path d="M73 88 Q82 96 91 88" /><path d="M109 88 Q118 96 127 88" />
    </g>
  );
  if (mood === "shy") return null;
  const up = mood === "think";
  return (
    <g className="regi-eyes">
      <g className="regi-pupils" transform={up ? "translate(2 -3)" : undefined}>
        <ellipse cx="82" cy="88" rx="8" ry="10" fill={INK} /><ellipse cx="118" cy="88" rx="8" ry="10" fill={INK} />
        <circle cx="85" cy="84" r="3.2" fill="#fff" /><circle cx="121" cy="84" r="3.2" fill="#fff" />
        <circle cx="79.5" cy="92" r="1.4" fill="#fff" /><circle cx="115.5" cy="92" r="1.4" fill="#fff" />
      </g>
      {mood === "sad" && <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round"><path d="M72 76 L90 71" /><path d="M128 76 L110 71" /></g>}
      {mood === "think" && <path d="M108 72 Q118 66 128 71" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
    </g>
  );
}

function Mouth({ mood }) {
  const s = { fill: "none", stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
  if (mood === "cheer" || mood === "wave") return (
    <g>
      <path d="M89 110 Q100 128 111 110 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M94 117 Q100 124 106 117 Q100 113 94 117Z" fill="#ff7a93" />
    </g>
  );
  if (mood === "sad") return <path d="M91 118 Q100 110 109 118" {...s} />;
  if (mood === "think") return <ellipse cx="103" cy="115" rx="4" ry="4.5" fill={INK} />;
  if (mood === "sleep") return <path d="M95 113 Q100 117 105 113" {...s} />;
  return <g {...s}><path d="M100 107 V111" /><path d="M100 111 Q94 118 87 112" /><path d="M100 111 Q106 118 113 112" /></g>;
}

export default function Regi({ mood = "happy", size = 120, head = false, className = "", title }) {
  const up = mood === "cheer";
  return (
    <svg className={`regi regi-${mood} ${className}`} width={size} height={head ? size : size * 1.1} viewBox={head ? "22 2 156 156" : "0 0 200 220"} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {!head && <>
        <ellipse cx="100" cy="212" rx="52" ry="6" fill="#000" opacity=".18" className="regi-shadow" />
        <g className="regi-body">
          <g className="regi-tail">
            <path d="M130 186 Q168 190 164 156" fill="none" stroke="#f2a93b" strokeWidth="8" strokeLinecap="round" />
            <path d="M164 132 l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2z" fill="#ffd23f" stroke="#e39a12" strokeWidth="2" strokeLinejoin="round" />
          </g>
          <ellipse cx="82" cy="205" rx="17" ry="9" fill="#f2a93b" /><ellipse cx="118" cy="205" rx="17" ry="9" fill="#f2a93b" />
          <ellipse cx="100" cy="174" rx="37" ry="34" fill="#ffc94d" />
          <ellipse cx="100" cy="180" rx="21" ry="22" fill="#fff3d1" />
        </g>
      </>}
      <g className="regi-head">
        <g fill="#e8791a">
          <circle cx="100" cy="88" r="60" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return <circle key={i} cx={100 + 58 * Math.cos(a)} cy={88 + 58 * Math.sin(a)} r="15" />; })}
        </g>
        <circle cx="100" cy="88" r="54" fill="#f39a2b" />
        <circle cx="60" cy="48" r="15" fill="#ffc94d" /><circle cx="60" cy="49" r="8" fill="#ff9eb0" />
        <circle cx="140" cy="48" r="15" fill="#ffc94d" /><circle cx="140" cy="49" r="8" fill="#ff9eb0" />
        <circle cx="100" cy="92" r="46" fill="#ffcf5c" />
        <ellipse cx="100" cy="110" rx="23" ry="17" fill="#fff3d1" />
        <g className="regi-crown">
          <path d="M82 40 L77 16 L91 27 L100 10 L109 27 L123 16 L118 40 Z" fill="#ffd23f" stroke="#e39a12" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="100" cy="31" r="3.5" fill="#ff5470" /><circle cx="88" cy="33" r="2.4" fill="#19c2b3" /><circle cx="112" cy="33" r="2.4" fill="#19c2b3" />
        </g>
        <circle cx="66" cy="106" r="8" fill="#ff8fa3" opacity=".65" /><circle cx="134" cy="106" r="8" fill="#ff8fa3" opacity=".65" />
        <Eyes mood={mood} />
        <path d="M92 99 Q100 95 108 99 Q105 106 100 107 Q95 106 92 99Z" fill="#8a4a25" />
        <Mouth mood={mood} />
        {mood === "sad" && <path d="M70 100 q-4 8 0 11 q4 -3 0 -11z" fill="#7fd4ff" />}
        {mood === "sleep" && <g className="regi-zzz" fill="#fff" fontFamily="Fredoka Variable, sans-serif" fontWeight="700"><text x="146" y="50" fontSize="20">z</text><text x="160" y="32" fontSize="26">z</text></g>}
        {mood === "shy" && <g fill="#ffc94d" stroke="#e8a52b" strokeWidth="2"><ellipse cx="80" cy="90" rx="15" ry="12" /><ellipse cx="120" cy="90" rx="15" ry="12" /></g>}
      </g>
      {!head && mood !== "shy" && <g fill="#ffc94d" stroke="#eab040" strokeWidth="1.5">
        <ellipse className={`regi-arm l ${up ? "up" : ""}`} cx="66" cy="178" rx="9.5" ry="20" />
        <ellipse className={`regi-arm r ${up ? "up" : mood === "wave" ? "wave" : mood === "think" ? "chin" : ""}`} cx="134" cy="178" rx="9.5" ry="20" />
      </g>}
    </svg>
  );
}
