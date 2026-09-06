"use client";
import { Search } from "lucide-react";
export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <label className="search-field"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search your films..." aria-label="Search films by title" /></label>; }