"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPartyAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Musíš byť prihlásený pre vytvorenie akcie." };
    }

    const name = (formData.get("name") as string)?.trim();
    const type = (formData.get("type") as string)?.trim() || "CLUB";
    const music = (formData.get("music") as string)?.trim() || "House";
    const location = (formData.get("location") as string)?.trim();
    const date = (formData.get("date") as string)?.trim();
    const startTime = (formData.get("startTime") as string)?.trim();
    const endTime = (formData.get("endTime") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim();
    const is18Plus = formData.get("is18Plus") === "true";
    let image = (formData.get("image") as string)?.trim();

    if (!name || !location || !date || !startTime || !description) {
      return { error: "Vyplň všetky povinné polia." };
    }

    if (!image) {
      image = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop";
    }

    // Default Prague city & country
    const praha = await prisma.city.findFirst({
      where: { slug: "praha" },
      include: { country: true },
    });

    if (!praha) {
      return { error: "Chyba systému: Mesto Praha nebolo nájdené." };
    }

    // Subtle coordinate jitter around Prague center (50.0755, 14.4378)
    const latJitter = (Math.random() - 0.5) * 0.03;
    const lngJitter = (Math.random() - 0.5) * 0.04;
    const latitude = Number((50.0825 + latJitter).toFixed(4));
    const longitude = Number((14.4255 + lngJitter).toFixed(4));

    const newParty = await prisma.party.create({
      data: {
        name,
        type,
        music,
        location,
        date,
        startTime,
        endTime,
        description,
        image,
        is18Plus,
        latitude,
        longitude,
        cityId: praha.id,
        countryId: praha.countryId,
        organizerId: session.userId,
        status: "ACTIVE",
      },
    });

    revalidatePath("/");
    revalidatePath(`/party/${newParty.id}`);

    return { success: true, partyId: newParty.id };
  } catch (err) {
    console.error("Create party error:", err);
    return { error: "Nepodarilo sa vytvoriť párty. Skús to znova." };
  }
}
