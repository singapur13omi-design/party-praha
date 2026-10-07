"use client";

import { useState } from "react";
import { ratePartyAction } from "@/app/actions/requests";
import { Star, Check } from "lucide-react";

interface PartyRatingFormProps {
  partyId: string;
  initialStars?: number | null;
  canRate: boolean; // only checked-in attendees
}

export default function PartyRatingForm({
  partyId,
  initialStars,
  canRate,
}: PartyRatingFormProps) {
  const [stars, setStars] = useState<number>(initialStars || 0);
  const [hovered, setHovered] = useState<number>(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!canRate) return null;

  async function handleRate(selected: number) {
    setLoading(true);
    setStars(selected);
    const res = await ratePartyAction(partyId, selected);
    setLoading(false);
    if (res?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Ako hodnotíš túto akciu?
        </span>
        {saved && (
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Hodnotenie uložené!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={loading}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            className="p-1 text-zinc-600 hover:scale-110 transition"
          >
            <Star
              className={`w-6 h-6 transition ${
                (hovered || stars) >= star
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-600"
              }`}
            />
          </button>
        ))}
        {stars > 0 && (
          <span className="text-xs font-bold text-amber-400 ml-2">
            {stars}.0 / 5.0
          </span>
        )}
      </div>
    </div>
  );
}
