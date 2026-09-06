"use client";
import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

export function TagPicker({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");
  function addTag() { const tag = draft.trim().replace(/,/g, ""); if (tag && !value.includes(tag)) onChange([...value, tag]); setDraft(""); }
  function keyDown(event: KeyboardEvent<HTMLInputElement>) { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(); } }
  return <div><p className="mb-2 text-xs font-normal text-[var(--muted)]">Personal labels for how this film felt to you, separate from its official genres.</p><div className="field tag-picker flex min-h-12 flex-wrap items-center gap-2 p-2"><div className="flex flex-wrap gap-1">{value.map((tag) => <span className="tag" key={tag}>{tag}<button type="button" className="ml-1 rounded-full" onClick={() => onChange(value.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X size={12} /></button></span>)}</div><input className="min-w-40 flex-1 bg-transparent px-1 py-1 text-sm text-[var(--paper)] outline-0" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={keyDown} onBlur={addTag} placeholder={value.length ? "Add another label" : "Add a few words to remember this one by"} aria-label="Personal film tags" /></div><p className="mt-2 text-xs text-[var(--muted)]">Try: emotional, mind-bending, comfort film</p></div>;
}