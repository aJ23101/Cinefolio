"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clapperboard, Film, LogOut, Plus, BarChart3, Settings, Sparkles, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter();
  const nav = [{ href: "/", label: "Discover", icon: Sparkles }, { href: "/watchlist", label: "Watchlist", icon: Bookmark }, { href: "/movies", label: "My Films", icon: Film }, { href: "/stats", label: "The numbers", icon: BarChart3 }, { href: "/settings", label: "Settings", icon: Settings }];
  async function signOut() { await createClient().auth.signOut(); toast.success("Your film history is safe. See you next time."); router.push("/login"); router.refresh(); }
  return <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
    <header className="site-header"><Link href="/" className="brand"><Clapperboard size={22} /><span>Cinefolio</span></Link>
      <nav className="flex items-center gap-1 sm:gap-2">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("nav-link", (href === "/" ? pathname === "/" : pathname.startsWith(href)) && "nav-link-active")}><Icon size={16} /><span className="hidden sm:inline">{label}</span></Link>)}</nav>
      <div className="flex items-center gap-2"><Link href="/log/new" className="button button-accent"><Plus size={17} /><span className="hidden sm:inline">Log a Film</span><span className="sm:hidden">Log</span></Link><button type="button" onClick={signOut} className="icon-button" title="Sign Out"><LogOut size={17} /></button></div>
    </header><main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-8">{children}</main>
  </div>;
}
