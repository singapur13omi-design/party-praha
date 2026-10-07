"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Request attendance for a party
export async function requestAttendanceAction(partyId: string, note?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Musíš byť prihlásený pre požiadanie o účasť." };
    }

    const party = await prisma.party.findUnique({
      where: { id: partyId },
      include: { requests: true },
    });

    if (!party) {
      return { error: "Párty neexistuje." };
    }

    if (party.status !== "ACTIVE") {
      return { error: "Táto akcia už nie je aktívna." };
    }

    // Check existing request
    const existing = await prisma.partyRequest.findUnique({
      where: {
        partyId_userId: {
          partyId,
          userId: session.userId,
        },
      },
    });

    if (existing) {
      return { error: `Už máš žiadosť v stave: ${existing.status}` };
    }

    const newRequest = await prisma.partyRequest.create({
      data: {
        partyId,
        userId: session.userId,
        status: "PENDING",
        note: note?.trim() || null,
      },
    });

    revalidatePath(`/party/${partyId}`);
    revalidatePath("/profile");

    return { success: true, requestId: newRequest.id };
  } catch (err) {
    console.error("requestAttendanceAction error:", err);
    return { error: "Nepodarilo sa odoslať žiadosť. Skús to znova." };
  }
}

// Organizer: Approve or Reject Request
export async function manageRequestAction(requestId: string, action: "APPROVE" | "REJECT") {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Neautorizovaný prístup." };
    }

    const request = await prisma.partyRequest.findUnique({
      where: { id: requestId },
      include: { party: true },
    });

    if (!request) {
      return { error: "Žiadosť nenájdená." };
    }

    if (request.party.organizerId !== session.userId) {
      return { error: "Nemáš oprávnenie spravovať túto akciu." };
    }

    if (action === "APPROVE") {
      // Update request to APPROVED
      await prisma.partyRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      });

      // Generate Ticket with secure random QR token
      const qrToken = `PP-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;
      await prisma.ticket.upsert({
        where: { id: `ticket-${request.partyId}-${request.userId}` },
        update: { status: "VALID", qrToken },
        create: {
          id: `ticket-${request.partyId}-${request.userId}`,
          partyId: request.partyId,
          userId: request.userId,
          qrToken,
          status: "VALID",
        },
      });
    } else {
      await prisma.partyRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/party/${request.partyId}`);

    return { success: true };
  } catch (err) {
    console.error("manageRequestAction error:", err);
    return { error: "Chyba pri spracovaní žiadosti." };
  }
}

// Check-in Ticket (Organizer scans QR token)
export async function checkInTicketAction(qrToken: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Musíš byť prihlásený ako organizátor." };
    }

    const ticket = await prisma.ticket.findUnique({
      where: { qrToken: qrToken.trim() },
      include: { party: true, user: true, attendance: true },
    });

    if (!ticket) {
      return { error: "Lístok neexistuje alebo je neplatný." };
    }

    if (ticket.party.organizerId !== session.userId) {
      return { error: "Nemáš oprávnenie pre check-in tejto akcie." };
    }

    if (ticket.status === "USED" || ticket.attendance) {
      return { error: "Tento lístok bol UŽ POUŽITÝ!" };
    }

    // Mark ticket as USED and create official Attendance record
    await prisma.$transaction([
      prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: "USED" },
      }),
      prisma.attendance.create({
        data: {
          ticketId: ticket.id,
          partyId: ticket.partyId,
          userId: ticket.userId,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      userName: ticket.user.name,
      partyName: ticket.party.name,
    };
  } catch (err) {
    console.error("checkInTicketAction error:", err);
    return { error: "Chyba pri check-in." };
  }
}

// Attendee: Rate Party (1-5 stars)
export async function ratePartyAction(partyId: string, stars: number, comment?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Musíš byť prihlásený pre hodnotenie." };
    }

    if (stars < 1 || stars > 5) {
      return { error: "Hodnotenie musí byť 1 až 5 hviezdičiek." };
    }

    // Verify user actually attended this party
    const attended = await prisma.attendance.findUnique({
      where: {
        partyId_userId: {
          partyId,
          userId: session.userId,
        },
      },
    });

    if (!attended) {
      return { error: "Hodnotiť môže iba overený účastník, ktorý prešiel check-inom." };
    }

    await prisma.rating.upsert({
      where: {
        partyId_userId: {
          partyId,
          userId: session.userId,
        },
      },
      update: { stars, comment: comment?.trim() || null },
      create: {
        partyId,
        userId: session.userId,
        stars,
        comment: comment?.trim() || null,
      },
    });

    revalidatePath(`/party/${partyId}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (err) {
    console.error("ratePartyAction error:", err);
    return { error: "Nepodarilo sa uložiť hodnotenie." };
  }
}
