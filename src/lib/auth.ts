import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "maktub_admin";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

export const isAdminConfigured = Boolean(process.env.ADMIN_PASSWORD?.trim());

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "maktub-development-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return timingSafeEqual(hash(password), hash(expected));
}

export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const store = await cookies();

  store.set(COOKIE_NAME, `${expiresAt}.${sign(String(expiresAt))}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) < Date.now()) return false;

  const expected = sign(expiresAt);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
