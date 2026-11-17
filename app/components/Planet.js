// A small CSS planet that stands for one chapter. Every chapter gets its own colour and surface
// (craters, a ring, stripes or spots) so the map reads like a solar system, not a list.
const PAL = [
  ["#ffe08a", "#f5a524", "#a8590a"], ["#8ff0e2", "#17c3b2", "#08746a"], ["#ffb3c2", "#ff5470", "#a91f3b"],
  ["#b9c2ff", "#5468ff", "#28319a"], ["#dcc6ff", "#9b6bff", "#5329b8"], ["#ffcaa3", "#ff8a3d", "#a74c12"],
  ["#aef0b2", "#3cbf5a", "#1b6e31"], ["#a6e1ff", "#2ea7f0", "#135f8f"],
];
export default function Planet({ n, size = 80, state = "open" }) {
  const [a, b, c] = PAL[(n - 1) % PAL.length];
  const kind = (n - 1) % 4;
  return (
    <span className={`sphere k${kind} ${state}`} style={{ "--a": a, "--b": b, "--c": c, "--s": `${size}px`, "--r": `${(n * 47) % 180 - 90}deg` }} aria-hidden="true">
      {kind === 1 && <b className="ring back" />}
      <i />
      {kind === 1 && <b className="ring front" />}
    </span>
  );
}
