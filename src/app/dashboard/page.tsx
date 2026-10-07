import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle2,
  Star,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import CheckInScanner from "@/components/CheckInScanner";
import OrganizerRequestList from "@/components/OrganizerRequestList";

export const dynamic = "force-dynamic";

export default async function OrganizerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  // Fetch organizer's parties with requests, tickets, attendances, and ratings
  const parties = await prisma.party.findMany({
    where: { organizerId: session.userId },
    include: {
      requests: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              ageVerified: true,
              identityVerified: true,
            },
          },
          party: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      tickets: true,
      attendances: true,
      ratings: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate stats
  const totalParties = parties.length;
  const allRequests = parties.flatMap((p) => p.requests);
  const totalApproved = allRequests.filter((r) => r.status === "APPROVED").length;
  const totalCheckIns = parties.reduce((acc, p) => acc + p.attendances.length, 0);
  const allRatings = parties.flatMap((p) => p.ratings);
  const avgRating =
    allRatings.length > 0
      ? (allRatings.reduce((acc, r) => acc + r.stars, 0) / allRatings.length).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[#06070b] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs md:text-sm font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="w-4 h-4" /> Späť na mapu
          </Link>
          <div className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
            PARTY <span className="text-pink-500">PRAHA</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
              ORGANIZER HUB
            </span>
          </div>
          <Link
            href="/profile"
            className="text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            Môj Profil
          </Link>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Title and Top Promotion Hook */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Správa akcií a účastníkov
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Schvaľuj hostí, overuj QR lístky pri vstupe a sleduj štatistiky svojich párty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> REKLAMA / PROMO (SLOT)
            </div>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Moje Akcie</span>
              <Calendar className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalParties}</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Žiadosti</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {allRequests.length} <span className="text-xs text-zinc-500">({totalApproved} schválených)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Check-iny</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalCheckIns}</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Priemerné Hodnotenie</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {avgRating} <span className="text-xs text-zinc-500">({allRatings.length} hodnotení)</span>
            </div>
          </div>
        </section>

        {/* Check-In QR Scanner Terminal */}
        <CheckInScanner />

        {/* Attendance Requests Management */}
        <section className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <h3 className="text-base font-black text-white uppercase tracking-tight">
            Žiadosti o účasť (Applicants)
          </h3>
          <OrganizerRequestList initialRequests={allRequests} />
        </section>

        {/* Parties Breakdown */}
        <section className="space-y-4">
          <h3 className="text-base font-black text-white uppercase tracking-tight">
            Prehľad tvojich akcií
          </h3>

          {parties.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center">
              <p className="text-xs text-zinc-400 mb-4">Zatiaľ si nezaložil žiadnu akciu.</p>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold uppercase"
              >
                Založiť párty
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parties.map((party) => {
                const partyApproved = party.requests.filter((r) => r.status === "APPROVED").length;
                const remainingCap = Math.max(0, party.capacity - partyApproved);
                return (
                  <div
                    key={party.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-400 uppercase">
                        {party.type} • {party.music}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {party.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white uppercase truncate">
                      {party.name}
                    </h4>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                      <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Žiadostí</div>
                        <div className="font-bold text-white">{party.requests.length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Schválených</div>
                        <div className="font-bold text-emerald-400">{partyApproved}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Voľné Miesta</div>
                        <div className="font-bold text-cyan-400">{remainingCap}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <Link
                        href={`/party/${party.id}`}
                        className="text-pink-400 hover:text-pink-300 font-bold uppercase text-[11px]"
                      >
                        Otvoriť detail akcie →
                      </Link>
                      <span className="text-zinc-500 text-[11px]">
                        Check-in: {party.attendances.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
