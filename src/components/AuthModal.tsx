"use client";

import { useState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { X, Sparkles, Mail, Lock, User as UserIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = isRegister ? await registerAction(formData) : await loginAction(formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      onSuccess();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 md:p-8 shadow-2xl shadow-purple-950/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-pink-500 font-bold tracking-widest text-xs uppercase">
          <Sparkles className="w-4 h-4" />
          PARTY PRAHA IDENTITY
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          {isRegister ? "Vytvor si účet" : "Prihlásenie"}
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {isRegister
            ? "Pripoj sa k pražskej nightlife komunite a organizuj akcie."
            : "Prihlás sa a spravuj svoje akcie a objavovanie."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Meno / Názov
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Tvoje meno alebo klub"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                name="email"
                type="email"
                required
                placeholder="tvoj@email.cz"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
              Heslo
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold tracking-wide hover:from-pink-500 hover:to-purple-500 active:scale-98 transition shadow-lg shadow-pink-600/30 disabled:opacity-50"
          >
            {loading ? "Spracovávam..." : isRegister ? "Zaregistrovať sa" : "Prihlásiť sa"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          {isRegister ? "Už máš účet?" : "Ešte nemáš účet?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-4 ml-1"
          >
            {isRegister ? "Prihlás sa tu" : "Registruj sa tu"}
          </button>
        </div>
      </div>
    </div>
  );
}
