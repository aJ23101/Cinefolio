"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
export function DeleteLogButton({ id }: { id: string }) { const [busy, setBusy] = useState(false); const router = useRouter(); async function remove() { if (!window.confirm("Remove this film from your collection?")) return; setBusy(true); const { error } = await createClient().from("logs").delete().eq("id", id); if (error) toast.error(error.message); else { toast.success("Film removed. The memory stays yours."); router.push("/movies"); router.refresh(); } setBusy(false); } return <button onClick={remove} disabled={busy} className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-red-300"><Trash2 size={15} /> {busy ? "Removing..." : "Delete this film"}</button>; }