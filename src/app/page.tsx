import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import DiscoveryClient from "@/components/DiscoveryClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  // Fetch all active parties from Neon database
  const parties = await prisma.party.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      { date: "asc" },
      { startTime: "asc" },
    ],
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <DiscoveryClient
      initialParties={parties}
      user={session ? { name: session.name, email: session.email } : null}
    />
  );
}
