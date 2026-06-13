import "server-only";
import db from "@/lib/db";

/**
 * Refuse an operation that would leave the system with zero active admins.
 * Called before demote/deactivate of an admin.
 */
export async function assertNotLastActiveAdmin(targetId: string): Promise<void> {
  const target = await db.user.findUnique({
    where: { id: targetId },
    select: { isAdmin: true, isActive: true },
  });
  if (!target?.isAdmin || !target.isActive) return; // not an active admin → no risk

  const activeAdmins = await db.user.count({
    where: { isAdmin: true, isActive: true },
  });
  if (activeAdmins <= 1) {
    throw new Error("Nelze odebrat posledního aktivního administrátora.");
  }
}
