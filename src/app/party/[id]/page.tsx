import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Sparkles,
  ArrowLeft,
  Flame,
} from "lucide-react";
import type { Metadata } from "next";
import ShareButton from "./ShareButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const party = await prisma.party.findUnique({
    where: { id },
  });

  if (!party) {
    return {
      title: "Párty nenájdená | PARTY PRAHA",
    };
  }

  return {
    title: `${party.name} | PARTY PRAHA`,
    description: `${party.type} • ${party.music} v ${party.location}. Štart o ${party.startTime}. Objav nočný život v Prahe na PARTY PRAHA.`,
    openGraph: {
      title: `${party.name} | PARTY PRAHA`,
      description: `${party.type} • ${party.music} v ${party.location}. Štart o ${party.startTime}.`,
      images: [party.image],
    },
  };
}

export default async function PartyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const party = await prisma.party.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          name: true,
          email: true,
        },
      },
      city: true,
      country: true,
    },
  });

  if (!party) {
    notFound();
  }

  const mapDirectionUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${party.location}, Praha`
  )}`;

  return (
    <div className="min-h-screen bg-[#06070b] text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs md:text-sm font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="w-4 h-4" /> Späť na mapu
          </Link>
          <div className="text-sm font-black uppercase tracking-tight text-white">
            PARTY <span className="text-pink-500">PRAHA</span>
          </div>
          <ShareButton partyName={party.name} />
        </div>
      </header>

      {/* Main Detail Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <div className="rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
          {/* Hero Visual */}
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={party.image}
              alt={party.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-pink-500/40 text-pink-400 text-xs font-black tracking-wider uppercase">
                {party.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-bold tracking-wider uppercase">
                {party.music}
              </span>
              {party.is18Plus && (
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-wider">
                  18+ ONLY
                </span>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                {party.name}
              </h1>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Dátum akcie
                  </div>
                  <div className="text-sm font-black text-white">{party.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Čas štartu
                  </div>
                  <div className="text-sm font-black text-white">
                    {party.startTime} {party.endTime ? `– ${party.endTime}` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Lokalita
                  </div>
                  <div className="text-sm font-black text-white truncate">
                    {party.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Call-To-Action: GO THERE */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/20 to-zinc-950 border border-pink-500/30">
              <div className="flex-1">
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <Flame className="w-5 h-5 text-pink-500" />
                  MÁM ÍSŤ SEM DNES VEČER?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Akcia je aktívna na mape Prahy. Klikni nižšie pre okamžité otvorenie navigácie a smerovania.
                </p>
              </div>

              <a
                href={mapDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider transition shadow-lg shadow-pink-600/30 active:scale-95"
              >
                <Navigation className="w-4 h-4" /> NAVIGOVAŤ DO KLUBU
              </a>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                O TEJTO PÁRTY & ATMOSFÉRA
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/60">
                {party.description}
              </p>
            </div>

            {/* Organizer Info */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <div>
                Organizátor:{" "}
                <span className="text-zinc-300 font-semibold">
                  {party.organizer.name}
                </span>
              </div>
              <div>Mesto: Praha, Česká republika</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
