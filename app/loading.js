import Regi from "./components/Regi";
export default function Loading() {
  return <div className="loading" role="status"><Regi mood="happy" size={72} head className="float" /><span>Yuklanmoqda…</span></div>;
}
