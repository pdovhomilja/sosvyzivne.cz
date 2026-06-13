"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/server";
import { assertNotLastActiveAdmin } from "@/lib/cms/users";
import { Prisma, type UserAuditAction } from "@/lib/generated/prisma/client";

const inviteInput = z.object({
  email: z.email().toLowerCase(),
  name: z.string().min(1).max(120).optional(),
});
const idInput = z.object({ id: z.string() });
const renameInput = z.object({ id: z.string(), name: z.string().min(1).max(120) });

async function audit(
  action: UserAuditAction,
  targetId: string,
  actorId: string,
  meta?: Record<string, unknown>,
) {
  await db.userAuditLog.create({
    data: {
      action,
      targetId,
      actorId,
      meta:
        meta !== undefined ? (meta as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });
}

export async function inviteUser(raw: unknown) {
  const session = await requireAdmin();
  const { email, name } = inviteInput.parse(raw);

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    const wasActive = existing.isActive;
    const wasAdmin = existing.isAdmin;
    const updated = await db.user.update({
      where: { id: existing.id },
      data: { isAdmin: true, isActive: true, name: name ?? existing.name },
    });
    if (!wasActive) await audit("REACTIVATED", updated.id, session.user.id);
    if (!wasAdmin && wasActive)
      await audit("PROMOTED", updated.id, session.user.id);
    revalidatePath("/users");
    return updated;
  }

  const created = await db.user.create({
    data: {
      email,
      name: name ?? email.split("@")[0],
      emailVerified: true,
      isAdmin: true,
      isActive: true,
    },
  });
  await audit("INVITED", created.id, session.user.id);
  revalidatePath("/users");
  return created;
}

export async function toggleAdmin(raw: unknown) {
  const session = await requireAdmin();
  const { id } = idInput.parse(raw);
  if (id === session.user.id) throw new Error("Nemůžete měnit vlastní roli.");

  const target = await db.user.findUnique({ where: { id } });
  if (!target) throw new Error("Uživatel nenalezen.");
  if (target.isAdmin) await assertNotLastActiveAdmin(id);

  const updated = await db.user.update({
    where: { id },
    data: { isAdmin: !target.isAdmin },
  });
  await audit(updated.isAdmin ? "PROMOTED" : "DEMOTED", id, session.user.id);
  revalidatePath("/users");
  return updated;
}

export async function deactivateUser(raw: unknown) {
  const session = await requireAdmin();
  const { id } = idInput.parse(raw);
  if (id === session.user.id) throw new Error("Nemůžete deaktivovat sami sebe.");

  await assertNotLastActiveAdmin(id);
  const updated = await db.user.update({
    where: { id },
    data: { isActive: false },
  });
  // Kill live sessions for the deactivated user.
  await db.session.deleteMany({ where: { userId: id } });
  await audit("DEACTIVATED", id, session.user.id);
  revalidatePath("/users");
  return updated;
}

export async function reactivateUser(raw: unknown) {
  const session = await requireAdmin();
  const { id } = idInput.parse(raw);
  const updated = await db.user.update({
    where: { id },
    data: { isActive: true },
  });
  await audit("REACTIVATED", id, session.user.id);
  revalidatePath("/users");
  return updated;
}

export async function updateUserName(raw: unknown) {
  const session = await requireAdmin();
  const { id, name } = renameInput.parse(raw);
  const before = await db.user.findUnique({
    where: { id },
    select: { name: true },
  });
  const updated = await db.user.update({ where: { id }, data: { name } });
  await audit("RENAMED", id, session.user.id, { from: before?.name, to: name });
  revalidatePath("/users");
  return updated;
}
