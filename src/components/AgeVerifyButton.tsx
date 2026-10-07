"use client";

import { useState } from "react";
import { verifyAgeAction } from "@/app/actions/auth";
import { ShieldAlert, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgeVerifyButton({ isVerified }: { isVerified: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isVerified) {
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
        <Check className="w-3 h-3" /> 18+ VERIFIED
      </span>
    );
  }

  async function handleVerify() {
    setLoading(true);
    const res = await verifyAgeAction();
    setLoading(false);
    if (res?.success) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
      title="Klikni pre overenie veku 18+"
    >
      <ShieldAlert className="w-3 h-3 text-amber-400" />
      {loading ? "Overujem..." : "OVERIŤ VEK 18+"}
    </button>
  );
}
