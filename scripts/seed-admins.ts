/**
 * Bootstrap the first admin(s) from ADMIN_EMAILS. Run once after `db:migrate`:
 *   pnpm seed:admins
 * After this, manage admins in-app via /users.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { BOOTSTRAP_ADMIN_EMAILS } from "../lib/admin/admin-emails";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  if (BOOTSTRAP_ADMIN_EMAILS.length === 0) {
    console.warn("ADMIN_EMAILS is empty — nothing to seed.");
    return;
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  for (const email of BOOTSTRAP_ADMIN_EMAILS) {
    const user = await db.user.upsert({
      where: { email },
      update: { isAdmin: true, isActive: true },
      create: {
        email,
        name: email.split("@")[0],
        emailVerified: true,
        isAdmin: true,
        isActive: true,
      },
    });
    console.log(`✓ admin ready: ${user.email}`);
  }

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
