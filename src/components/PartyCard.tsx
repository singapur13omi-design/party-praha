import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Calendar, Sparkles, Star } from "lucide-react";

export interface PartyCardData {
  id: string;
  name: string;
  type: string;
  music: string;
  image: string;
  location: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  is18Plus?: boolean;
  avgRating?: string | null;
  ratingCount?: number;
}

interface PartyCardProps {
  party: PartyCardData;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function PartyCard({ party, isSelected, onSelect }: PartyCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl border transition cursor-pointer select-none ${
        isSelected
          ? "bg-zinc-900/90 border-pink-500 shadow-lg shadow-pink-500/20"
          : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full md:w-36 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-zinc-900">
        <Image
          src={party.image}
          alt={party.name}
          fill
          sizes="(max-width: 768px) 100vw, 150px"
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Type Badge */}
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-pink-400">
          {party.type}
        </div>
        {party.is18Plus && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
            18+
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{party.music}</span>
            </div>
            {party.avgRating && (
              <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{party.avgRating}</span>
                <span className="text-zinc-500 font-normal">({party.ratingCount})</span>
              </div>
            )}
          </div>

          <h3 className="text-base md:text-lg font-black text-white group-hover:text-pink-400 transition line-clamp-2 uppercase tracking-tight">
            {party.name}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span className="truncate">{party.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {party.date}
            </span>
            <span className="flex items-center gap-1 text-pink-400">
              <Clock className="w-3.5 h-3.5" />
              {party.startTime}
            </span>
          </div>

          <Link
            href={`/party/${party.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/30 text-xs font-bold uppercase tracking-wider transition"
          >
            DETAIL →
          </Link>
        </div>
      </div>
    </div>
  );
}
