"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, clearSession, getSession } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const name = (formData.get("name") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !name || !password || password.length < 6) {
      return { error: "Vyplň všetky polia. Heslo musí mať aspoň 6 znakov." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Používateľ s týmto emailom už existuje." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "USER",
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Chyba registrácie. Skús to znova." };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Zadaj email a heslo." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Nesprávny email alebo heslo." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { error: "Nesprávny email alebo heslo." };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Chyba prihlásenia. Skús to znova." };
  }
}

export async function logoutAction() {
  await clearSession();
  return { success: true };
}

export async function verifyAgeAction() {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Musíš byť prihlásený." };
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: { ageVerified: true },
    });

    return { success: true, ageVerified: updated.ageVerified };
  } catch (err) {
    console.error("verifyAgeAction error:", err);
    return { error: "Chyba pri overovaní veku." };
  }
}

