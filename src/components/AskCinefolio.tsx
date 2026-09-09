"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { useState } from "react";

type Reply = { answer: string; picks: Array<{ title: string; reason: string }> };
export function AskCinefolio() { const [question, setQuestion] = useState(""); const [reply, setReply] = useState<Reply | null>(null); const [busy, setBusy] = useState(false);
  async function ask(event: React.FormEvent) { event.preventDefault(); if (!question.trim()) return; setBusy(true); const response = await fetch("/api/cinefolio/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) }); const body = await response.json(); if (response.ok) setReply(body); else setReply({ answer: body.error ?? "Cinefolio couldn't answer just now.", picks: [] }); setBusy(false); }
  return <section className="ask-cinefolio"><div><p className="eyebrow">Ask Cinefolio</p><h2>What should I watch tonight?</h2><p>Ask about your mood, your time, or what&apos;s already on your list.</p></div><form onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Something like Severance, but lighter..." aria-label="Ask Cinefolio" /><button className="icon-button" disabled={busy} aria-label="Send question">{busy ? <span className="animate-pulse">...</span> : <ArrowUp size={17} />}</button></form>{reply && <div className="cinefolio-reply"><MessageCircle size={17} /><div><p>{reply.answer}</p>{reply.picks.map((pick) => <p className="reply-pick" key={pick.title}><strong>{pick.title}</strong> — {pick.reason}</p>)}</div></div>}</section>;
}
