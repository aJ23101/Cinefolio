import { Clapperboard, Film } from "lucide-react";
import type { CuratedPoster } from "@/lib/tmdb-server";

const slots = [
  { top: "-7%", left: "-12%", width: "36%", rotation: "-7deg", zIndex: 1 },
  { top: "-5%", left: "24%", width: "34%", rotation: "4deg", zIndex: 3 },
  { top: "-3%", left: "56%", width: "36%", rotation: "-4deg", zIndex: 2 },
  { top: "39%", left: "-4%", width: "35%", rotation: "5deg", zIndex: 4 },
  { top: "38%", left: "31%", width: "35%", rotation: "-3deg", zIndex: 5 },
  { top: "39%", left: "64%", width: "33%", rotation: "6deg", zIndex: 3 },
  { top: "74%", left: "10%", width: "35%", rotation: "-5deg", zIndex: 2 },
  { top: "74%", left: "44%", width: "34%", rotation: "3deg", zIndex: 4 },
  { top: "74%", left: "75%", width: "31%", rotation: "-4deg", zIndex: 1 },
];

export function PosterWall({ posters }: { posters: CuratedPoster[] }) {
  return <aside className="poster-wall" aria-hidden="true"><div className="poster-wall-brand"><Clapperboard size={24} /><span>Cinefolio</span></div>{posters.map((poster, index) => { const slot = slots[index]; return <div className="poster-wall-card" key={poster.id} style={{ top: slot.top, left: slot.left, width: slot.width, transform: `rotate(${slot.rotation})`, zIndex: slot.zIndex }}>{poster.poster_url ? <img src={poster.poster_url} alt="" /> : <span className="poster-wall-fallback"><Film size={30} /></span>}</div>; })}<div className="poster-wall-scrim" /></aside>;
}
