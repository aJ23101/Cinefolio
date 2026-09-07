import { LoginForm } from "@/app/login/LoginForm";
import { PosterWall } from "@/app/login/PosterWall";
import { getCuratedPosters } from "@/lib/tmdb-server";

export default async function LoginPage() {
  const posters = await getCuratedPosters();
  return <main className="login-shell"><PosterWall posters={posters} /><section className="login-panel"><LoginForm /></section></main>;
}
