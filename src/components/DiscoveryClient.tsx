"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PartyCard, { PartyCardData } from "@/components/PartyCard";
import { translations, Locale } from "@/lib/i18n";
import { Sparkles, Calendar, Music, Filter, MapPin, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dynamically import Leaflet map to ensure no SSR window errors
const PartyMap = dynamic(() => import("@/components/PartyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
        Načítavam mapu Prahy...
      </div>
    </div>
  ),
});

interface DiscoveryClientProps {
  initialParties: (PartyCardData & {
    latitude: number;
    longitude: number;
    description: string;
    organizer?: { name: string };
  })[];
  user: { name: string; email: string } | null;
}

const PARTY_TYPES = ["ALL", "CLUB", "RAVE", "HOUSE", "VIP", "PRIVATE", "FESTIVAL"];
const MUSIC_GENRES = ["ALL", "Techno", "House", "EDM", "DnB", "Hip-Hop", "Latin"];

export default function DiscoveryClient({ initialParties, user }: DiscoveryClientProps) {
  const [parties] = useState(initialParties);
  const [locale, setLocale] = useState<Locale>("cz");
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState<"TODAY" | "ALL">("TODAY");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [musicFilter, setMusicFilter] = useState("ALL");

  const t = translations[locale];

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter parties based on selections
  const filteredParties = useMemo(() => {
    return parties.filter((p) => {
      // Date filter
      if (dateFilter === "TODAY" && p.date !== todayStr) {
        return false;
      }
      // Type filter
      if (typeFilter !== "ALL" && p.type !== typeFilter) {
        return false;
      }
      // Music filter
      if (musicFilter !== "ALL" && p.music !== musicFilter) {
        return false;
      }
      return true;
    });
  }, [parties, dateFilter, typeFilter, musicFilter, todayStr]);

  const selectedParty = useMemo(() => {
    return parties.find((p) => p.id === selectedPartyId) || null;
  }, [parties, selectedPartyId]);

  return (
    <div className="min-h-screen bg-[#06070b] text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        user={user}
        locale={locale}
        onLocaleChange={setLocale}
        onPartyCreated={() => {
          // Trigger refresh
          window.location.reload();
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Top Promotional / Advertising Slot */}
        <section className="relative rounded-2xl p-4 bg-gradient-to-r from-purple-950/40 via-zinc-950 to-pink-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider">
              PROMO SLOT
            </span>
            <p className="text-xs text-zinc-300 font-medium">
              <span className="text-pink-400 font-bold uppercase">DUPLEX ROOFTOP PRAHA:</span> Sunset to Sunrise House sessions tonight!
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1 shrink-0"
          >
            VLASTNÁ REKLAMA PRE KLUBY →
          </Link>
        </section>

        {/* Primary Hook Banner */}
        <section className="relative rounded-2xl p-6 md:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-zinc-800/80 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              PRAHA TONIGHT LIVE
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {t.hook}
            </h1>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
              {t.subhook}
            </p>
          </div>

          {/* Quick Date Toggle Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-zinc-800/60">
            <button
              onClick={() => setDateFilter("TODAY")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase transition flex items-center gap-2 ${
                dateFilter === "TODAY"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.today}
            </button>
            <button
              onClick={() => setDateFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase transition flex items-center gap-2 ${
                dateFilter === "ALL"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.allDays}
            </button>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          {/* Party Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> TYP:
            </span>
            {PARTY_TYPES.map((pt) => (
              <button
                key={pt}
                onClick={() => setTypeFilter(pt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition ${
                  typeFilter === pt
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80"
                }`}
              >
                {pt}
              </button>
            ))}
          </div>

          {/* Music Genre Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Music className="w-3.5 h-3.5" /> HUDBA:
            </span>
            {MUSIC_GENRES.map((mg) => (
              <button
                key={mg}
                onClick={() => setMusicFilter(mg)}
                className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition ${
                  musicFilter === mg
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80"
                }`}
              >
                {mg}
              </button>
            ))}
          </div>
        </section>

        {/* Split Grid: Left = Discovery List, Right = Live Interactive Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Party List Feed (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                AKTUÁLNY VÝBER ({filteredParties.length})
              </h2>
              {selectedPartyId && (
                <button
                  onClick={() => setSelectedPartyId(null)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Zrušiť výber
                </button>
              )}
            </div>

            {filteredParties.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
                <p className="text-zinc-400 text-sm mb-4">{t.noParties}</p>
                <button
                  onClick={() => {
                    setDateFilter("ALL");
                    setTypeFilter("ALL");
                    setMusicFilter("ALL");
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-white hover:bg-zinc-800 transition"
                >
                  Resetovať filtre
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[700px] pr-1">
                {filteredParties.map((party) => (
                  <PartyCard
                    key={party.id}
                    party={party}
                    isSelected={party.id === selectedPartyId}
                    onSelect={() => setSelectedPartyId(party.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Interactive Map & Selected Marker Preview (order-1 on mobile, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-4">
            <div className="h-[400px] lg:h-[550px] w-full relative">
              <PartyMap
                parties={filteredParties}
                selectedPartyId={selectedPartyId}
                onSelectParty={(id) => setSelectedPartyId(id)}
              />
            </div>

            {/* Selected Marker Quick Pop-in Preview */}
            {selectedParty && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-pink-500/60 shadow-xl shadow-pink-500/10 flex flex-col sm:flex-row gap-4 items-center animate-in fade-in duration-200">
                <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={selectedParty.image}
                    alt={selectedParty.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400 mb-1">
                    <span>{selectedParty.type}</span>
                    <span>•</span>
                    <span className="text-cyan-400">{selectedParty.music}</span>
                  </div>
                  <h4 className="text-base font-black text-white uppercase truncate">
                    {selectedParty.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                    {selectedParty.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-zinc-300 font-semibold">
                    <span>{selectedParty.date}</span>
                    <span className="text-pink-400">štart {selectedParty.startTime}</span>
                  </div>
                </div>
                <div className="shrink-0 w-full sm:w-auto">
                  <Link
                    href={`/party/${selectedParty.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-pink-600/30"
                  >
                    OTVORIŤ DETAIL <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-black/90 py-8 px-4 mt-12 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            PARTY PRAHA — NIGHTLIFE DISCOVERY
          </div>
          <p>© 2026 PARTY PRAHA. Czech Republic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
