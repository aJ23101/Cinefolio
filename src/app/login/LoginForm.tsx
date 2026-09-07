"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [googleBusy, setGoogleBusy] = useState(false); const router = useRouter();
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!hasSupabaseConfig()) return toast.error("Cinefolio needs its Supabase keys in .env.local before anyone can sign in."); setBusy(true); const { error } = await createClient().auth.signInWithPassword({ email, password }); if (error) toast.error(error.message); else { toast.success("The lights are down. Welcome back."); router.push("/"); router.refresh(); } setBusy(false); }
  async function signInWithGoogle() { if (!hasSupabaseConfig()) return toast.error("Cinefolio needs its Supabase keys in .env.local before anyone can sign in."); setGoogleBusy(true); const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } }); if (error) { toast.error(error.message); setGoogleBusy(false); } }
  return <div className="login-content"><p className="eyebrow">Back to the picture</p><h1>Pick up where you left off.</h1><p className="login-intro">Sign in to get back to your reel.</p><div className="auth-card login-auth-card"><button type="button" className="button button-dark w-full" onClick={signInWithGoogle} disabled={googleBusy}><GoogleIcon /> {googleBusy ? "Opening Google..." : "Continue with Google"}</button><div className="auth-divider"><span>or</span></div><form onSubmit={submit} className="space-y-4"><label className="label">Email<input className="field mt-2" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="label">Password<input className="field mt-2" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="button button-accent mt-3 w-full" disabled={busy}>{busy ? "Opening your collection..." : "Sign in"}</button></form></div><p className="login-signup">New around here? <Link href="/signup">Start your film history</Link></p></div>;
}

function GoogleIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.1 14.7 2 12 2 6.9 2 2.7 6.2 2.7 12S6.9 22 12 22c6.9 0 9.3-4.9 9.3-7.4 0-.5 0-.9-.1-1.3H12Z" /></svg>; }
