"use client";

import { useState } from "react";
import { checkInTicketAction } from "@/app/actions/requests";
import { QrCode, CheckCircle2, AlertCircle, Scan } from "lucide-react";

export default function CheckInScanner() {
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    userName?: string;
    partyName?: string;
  } | null>(null);

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    if (!qrToken.trim()) return;

    setLoading(true);
    setResult(null);
    const res = await checkInTicketAction(qrToken.trim());
    setLoading(false);
    setResult(res);
    if (res.success) {
      setQrToken("");
    }
  }

  return (
    <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
      <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
        <Scan className="w-4 h-4" /> ORGANIZER CHECK-IN TERMINAL
      </div>
      <h3 className="text-lg font-black text-white uppercase tracking-tight">
        Overenie lístka a vstup hosťa
      </h3>
      <p className="text-xs text-zinc-400">
        Zadaj alebo naskenuj QR token z lístka návštevníka pre overenie a potvrdenie vstupu.
      </p>

      <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <QrCode className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="napr. PP-4A1B2C3D..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs uppercase text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !qrToken.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition disabled:opacity-50"
        >
          {loading ? "Overujem..." : "Potvrdiť check-in"}
        </button>
      </form>

      {result?.error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result?.success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold uppercase tracking-wider">
              VSTUP POTVRDENÝ: {result.userName}
            </div>
            <div className="text-[11px] text-emerald-300">
              Akcia: {result.partyName} • Lístok úspešne označený ako USED
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
