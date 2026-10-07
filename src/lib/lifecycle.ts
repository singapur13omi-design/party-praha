import { prisma } from "@/lib/prisma";

/**
 * Automatically transitions ended parties to ARCHIVED status.
 * Any party whose date is strictly before today is marked ARCHIVED
 * so it immediately drops out of active discovery and maps.
 */
export async function runPartyLifecycleArchive(): Promise<number> {
  const todayStr = new Date().toISOString().split("T")[0];

  const updateResult = await prisma.party.updateMany({
    where: {
      status: "ACTIVE",
      date: {
        lt: todayStr,
      },
    },
    data: {
      status: "ARCHIVED",
    },
  });

  return updateResult.count;
}
