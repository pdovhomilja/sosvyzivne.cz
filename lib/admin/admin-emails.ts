const list = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/**
 * Bootstrap-only: read by scripts/seed-admins.ts to create the first admin.
 * After bootstrap, the DB (User.isAdmin && User.isActive) is the source of
 * truth for authorization. New admins are invited via the in-app /users page.
 */
export const BOOTSTRAP_ADMIN_EMAILS = list;
