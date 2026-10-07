import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Calendar, Clock, MapPin, ArrowLeft, Plus, Sparkles, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  // Fetch full user record & their created parties from Neon
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      parties: {
        orderBy: [{ date: "desc" }, { startTime: "asc" }],
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#06070b] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs md:text-sm font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="w-4 h-4" /> Späť na mapu
          </Link>
          <div className="text-sm font-black uppercase tracking-tight text-white">
            PARTY <span className="text-pink-500">PRAHA</span> PROFILE
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-pink-600/30"
          >
            <Plus className="w-3.5 h-3.5" /> NOVÁ PÁRTY
          </Link>
        </div>
      </header>

      {/* Main Profile Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* User Card */}
        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-pink-600/20 shrink-0">
              <User className="w-10 h-10" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
                {user.ageVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    18+ OVERENÝ
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                {user.name}
              </h1>
              <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Created Parties List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              MOJE VYTVORENÉ AKCIE ({user.parties.length})
            </h2>
          </div>

          {user.parties.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
              <p className="text-zinc-400 text-sm mb-4">
                Zatiaľ si nevytvoril žiadnu párty v Prahe.
              </p>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-pink-500 transition shadow-lg shadow-pink-600/30"
              >
                Založiť prvú akciu na mape
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.parties.map((party) => (
                <div
                  key={party.id}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 flex flex-col justify-between gap-4 hover:border-zinc-700 transition"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                      <Image
                        src={party.image}
                        alt={party.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-pink-400 mb-1">
                        <span>{party.type}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{party.music}</span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">
                        {party.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        {party.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-3 text-zinc-400 font-medium">
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
                      className="px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/30 font-bold uppercase tracking-wider text-[11px] transition"
                    >
                      DETAIL →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
