"use client";

import { useState } from "react";
import { requestAttendanceAction } from "@/app/actions/requests";
import { Check, Clock, X, Sparkles, Send } from "lucide-react";

interface AttendanceRequestButtonProps {
  partyId: string;
  isLoggedIn: boolean;
  initialStatus?: string | null;
  onNeedLogin: () => void;
}

export default function AttendanceRequestButton({
  partyId,
  isLoggedIn,
  initialStatus,
  onNeedLogin,
}: AttendanceRequestButtonProps) {
  const [status, setStatus] = useState<string | null>(initialStatus || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState("");

  if (status === "APPROVED") {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider">
        <Check className="w-4 h-4" /> ÚČASŤ SCHVÁLENÁ (LÍSTOK V PROFILE)
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-wider">
        <Clock className="w-4 h-4" /> ŽIADOSŤ ČAKÁ NA SCHVÁLENIE
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-wider">
        <X className="w-4 h-4" /> ŽIADOSŤ BOLA ZAMIETNUTÁ
      </div>
    );
  }

  async function handleSendRequest() {
    if (!isLoggedIn) {
      onNeedLogin();
      return;
    }

    setLoading(true);
    setError(null);
    const res = await requestAttendanceAction(partyId, note);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setStatus("PENDING");
      setShowNoteModal(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          if (!isLoggedIn) {
            onNeedLogin();
          } else {
            setShowNoteModal(true);
          }
        }}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-cyan-500/30 active:scale-95"
      >
        <Sparkles className="w-4 h-4" /> POŽÁDAT O ÚČAST
      </button>

      {/* Note modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-black uppercase text-white tracking-tight">
                Žiadosť o účasť
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Organizátor skontroluje tvoju žiadosť a po schválení ti vystaví digitálny QR lístok.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Poznámka pre organizátora (nepovinné)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="napr. Ideme s partou 3 ľudí, tešíme sa na headline set..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? "Odosielam..." : "Odoslať žiadosť organizátorovi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
