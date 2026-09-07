"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  useEffect(() => { createClient().auth.getUser().then(({ data }) => setEmail(data.user?.email ?? "")); }, []);
  async function signOut() { await createClient().auth.signOut(); toast.success("Your film history is safe. See you next time."); router.push("/login"); router.refresh(); }
  return <AppShell><div className="settings-page"><p className="eyebrow">Your Collection</p><h1 className="mt-2 text-4xl font-semibold">Make Cinefolio yours.</h1><p className="mt-2 max-w-xl text-[var(--muted)]">Manage your account and preferences.</p><section className="surface-card settings-card mt-9"><p className="eyebrow">Account</p><h2 className="mt-2 text-xl font-semibold">Your Account</h2><p className="mt-4 text-sm text-[var(--muted)]">Signed in as <span className="text-[var(--paper)]">{email || "loading..."}</span></p><button type="button" className="button button-dark mt-8" onClick={signOut}>Sign Out</button></section></div></AppShell>;
}
