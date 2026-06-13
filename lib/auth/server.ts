import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import db from "@/lib/db";

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getSession(): Promise<AuthSession> {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error("[AUTH] getSession failed:", err);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session;
}

/**
 * Layout- and action-level guard. The DB is re-read every request so a
 * demoted/deactivated admin loses access immediately (the session field alone
 * is not trusted).
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const u = session.user as { id: string; isAdmin?: boolean };
  if (!u.isAdmin) redirect("/");

  const fresh = await db.user.findUnique({
    where: { id: u.id },
    select: { isAdmin: true, isActive: true },
  });
  if (!fresh?.isAdmin || !fresh?.isActive) redirect("/");

  return session;
}
