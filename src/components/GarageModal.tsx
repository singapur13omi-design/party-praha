"use client";

import { useState } from "react";
import { createPartyAction } from "@/app/actions/party";
import { X, Sparkles, MapPin, Calendar, Clock, Image as ImageIcon, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartyCreated: () => void;
}

export default function GarageModal({ isOpen, onClose, onPartyCreated }: GarageModalProps) {
  const router = useRouter();
  const [doorOpen, setDoorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createPartyAction(formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      onPartyCreated();
      onClose();
      if (res?.partyId) {
        router.push(`/party/${res.partyId}`);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-pink-500/30 shadow-2xl shadow-pink-900/30 overflow-hidden my-auto">
        {/* The Garage Door Overlay */}
        {!doorOpen && (
          <div className="absolute inset-0 z-30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black flex flex-col items-center justify-center p-8 text-center transition-all">
            {/* Metallic shutter grooves effect */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(0deg,#fff,#fff_4px,transparent_4px,transparent_16px)]" />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/40 text-pink-400 text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
                <Flame className="w-4 h-4" />
                SECRET GARAGE ACCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-3">
                GARÁŽ PÁRTY PRAHA
              </h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Vstupuješ do riadiaceho centra nočného života. Otvor bránu a zverejni svoju akciu pre celú Prahu.
              </p>

              <button
                type="button"
                onClick={() => setDoorOpen(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-base uppercase tracking-wider hover:opacity-95 active:scale-95 transition shadow-xl shadow-pink-500/40"
              >
                OTEVŘÍT GARÁŽ →
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Revealed Form after Garage Door Opens */}
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                VYTVOŘ SVOJI PARTY
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                Založiť novú akciu v Prahe
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Názov akcie *
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="napr. CROSS CLUB TECHNO CARNIVAL"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                  Typ párty
                </label>
                <select
                  name="type"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="CLUB">CLUB</option>
                  <option value="RAVE">RAVE</option>
                  <option value="HOUSE">HOUSE</option>
                  <option value="VIP">VIP</option>
                  <option value="PRIVATE">PRIVATE</option>
                  <option value="FESTIVAL">FESTIVAL</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                  Hudobný žáner
                </label>
                <select
                  name="music"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="Techno">Techno</option>
                  <option value="House">House</option>
                  <option value="EDM">EDM</option>
                  <option value="DnB">DnB</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Latin">Latin</option>
                  <option value="R'n'B">R&apos;n&apos;B</option>
                  <option value="Other">Iné</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Miesto / Klub & Adresa *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  name="location"
                  type="text"
                  required
                  placeholder="napr. Roxy Prague, Dlouhá 33, Praha 1"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                  Dátum *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                  Začiatok *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    name="startTime"
                    type="time"
                    required
                    defaultValue="22:00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                  Koniec
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    name="endTime"
                    type="time"
                    defaultValue="05:00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Obrázok akcie (URL)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  name="image"
                  type="url"
                  placeholder="https://... (ak necháš prázdne, priradí sa štýlový klubový vizuál)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Popis akcie a atmosféra *
              </label>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="Napíš, čo sa bude diať, aký je line-up, sound systém a prečo by mali ľudia prísť práve sem..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is18Plus"
                name="is18Plus"
                value="true"
                className="w-4 h-4 rounded border-zinc-700 text-pink-600 focus:ring-0"
              />
              <label htmlFor="is18Plus" className="text-xs font-medium text-zinc-300">
                Iba pre plnoletých (18+)
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black tracking-wider uppercase hover:opacity-95 active:scale-98 transition shadow-lg shadow-pink-600/30 disabled:opacity-50"
              >
                {loading ? "Publikujem akciu..." : "Publikovať akciu na mape Prahy"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
