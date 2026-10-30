"use server";

import { redirect } from "next/navigation";

import {
  createAdminSession,
  destroyAdminSession,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/auth";

export type LoginState = { error?: string };

const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 5 * 60 * 1000;

let attempts = { count: 0, blockedUntil: 0 };

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured) {
    return { error: "Falta configurar ADMIN_PASSWORD en las variables de entorno." };
  }

  if (attempts.blockedUntil > Date.now()) {
    return { error: "Demasiados intentos. Esperá unos minutos y volvé a probar." };
  }

  const password = String(formData.get("password") ?? "");
  const valid = verifyAdminPassword(password);

  if (!valid) {
    attempts.count += 1;
    if (attempts.count >= MAX_ATTEMPTS) {
      attempts = { count: 0, blockedUntil: Date.now() + BLOCK_TIME_MS };
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: "La contraseña no es correcta." };
  }

  attempts = { count: 0, blockedUntil: 0 };
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
