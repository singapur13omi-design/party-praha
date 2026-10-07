"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, User, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";
import GarageModal from "./GarageModal";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

interface NavbarProps {
  user: { name: string; email: string } | null;
  locale: Locale;
  onLocaleChange: (loc: Locale) => void;
  onPartyCreated: () => void;
}

export default function Navbar({ user, locale, onLocaleChange, onPartyCreated }: NavbarProps) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);

  async function handleLogout() {
    await logoutAction();
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-600/30 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-black tracking-tight text-white uppercase flex items-center gap-1">
                PARTY <span className="text-pink-500">PRAHA</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-widest text-zinc-400 uppercase -mt-1">
                NIGHTLIFE OPERATING SYSTEM
              </span>
            </div>
          </Link>

          {/* Actions & CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-bold text-zinc-400">
              <button
                onClick={() => onLocaleChange("cz")}
                className={`px-2 py-1 rounded ${locale === "cz" ? "bg-pink-600 text-white" : "hover:text-white"}`}
              >
                CZ
              </button>
              <button
                onClick={() => onLocaleChange("en")}
                className={`px-2 py-1 rounded ${locale === "en" ? "bg-pink-600 text-white" : "hover:text-white"}`}
              >
                EN
              </button>
              <button
                onClick={() => onLocaleChange("sk")}
                className={`px-2 py-1 rounded ${locale === "sk" ? "bg-pink-600 text-white" : "hover:text-white"}`}
              >
                SK
              </button>
            </div>

            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Odhlásiť"
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900/50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-bold text-white transition"
              >
                Prihlásiť
              </button>
            )}

            {/* Main Brand Action: ZALOŽ PARTY */}
            <button
              onClick={() => {
                if (!user) {
                  setAuthOpen(true);
                } else {
                  setGarageOpen(true);
                }
              }}
              className="relative group px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>ZALOŽ PARTY</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => router.refresh()}
      />

      <GarageModal
        isOpen={garageOpen}
        onClose={() => setGarageOpen(false)}
        onPartyCreated={() => {
          onPartyCreated();
          router.refresh();
        }}
      />
    </>
  );
}
