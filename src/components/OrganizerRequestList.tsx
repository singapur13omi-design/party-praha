"use client";

import { useState } from "react";
import { manageRequestAction } from "@/app/actions/requests";
import { Check, X, User, Clock, ShieldCheck } from "lucide-react";

interface RequestItem {
  id: string;
  status: string;
  note?: string | null;
  createdAt: Date | string;
  party: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    ageVerified: boolean;
    identityVerified: boolean;
  };
}

interface OrganizerRequestListProps {
  initialRequests: RequestItem[];
}

export default function OrganizerRequestList({ initialRequests }: OrganizerRequestListProps) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(requestId: string, action: "APPROVE" | "REJECT") {
    setLoadingId(requestId);
    const res = await manageRequestAction(requestId, action);
    setLoadingId(null);
    if (res?.success) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : r
        )
      );
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const processedRequests = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Clock className="w-4 h-4" /> ČAKAJÚCE ŽIADOSTI O ÚČASŤ ({pendingRequests.length})
        </h4>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
            Žiadne nové čakajúce žiadosti o účasť.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-sm font-black text-white">{req.user.name}</span>
                    <span className="text-xs text-zinc-500">({req.user.email})</span>
                    {req.user.ageVerified && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        18+ ✓
                      </span>
                    )}
                    {req.user.identityVerified && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> ID ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-pink-400 font-semibold truncate">
                    Akcia: {req.party.name}
                  </div>
                  {req.note && (
                    <div className="text-xs text-zinc-400 italic bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                      &ldquo;{req.note}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleAction(req.id, "APPROVE")}
                    disabled={loadingId === req.id}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> SCHVÁLIŤ
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "REJECT")}
                    disabled={loadingId === req.id}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> ZAMIETNUŤ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed requests log */}
      {processedRequests.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-zinc-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Spracované žiadosti ({processedRequests.length})
          </h4>
          <div className="space-y-2">
            {processedRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 flex items-center justify-between text-xs text-zinc-400"
              >
                <div>
                  <span className="font-semibold text-zinc-300">{req.user.name}</span> —{" "}
                  <span className="text-zinc-500">{req.party.name}</span>
                </div>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    req.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
