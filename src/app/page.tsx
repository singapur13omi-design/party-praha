import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { runPartyLifecycleArchive } from "@/lib/lifecycle";
import DiscoveryClient from "@/components/DiscoveryClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  // Run lifecycle cleanup: completed parties strictly before today become ARCHIVED
  await runPartyLifecycleArchive();

  // Fetch all active parties from Neon database with ratings
  const rawParties = await prisma.party.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      { isPromoted: "desc" },
      { date: "asc" },
      { startTime: "asc" },
    ],
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
      ratings: {
        select: {
          stars: true,
        },
      },
    },
  });

  const parties = rawParties.map((p) => {
    const ratingCount = p.ratings.length;
    const avgRating =
      ratingCount > 0
        ? (p.ratings.reduce((acc, r) => acc + r.stars, 0) / ratingCount).toFixed(1)
        : null;

    return {
      ...p,
      avgRating,
      ratingCount,
    };
  });

  return (
    <DiscoveryClient
      initialParties={parties}
      user={session ? { name: session.name, email: session.email } : null}
    />
  );
}
