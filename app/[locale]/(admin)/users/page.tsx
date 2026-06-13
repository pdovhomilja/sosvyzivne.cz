import { UsersTable } from "@/components/cms/users-table";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: Array<{
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isActive: boolean;
  }> = [];
  try {
    users = await db.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, isAdmin: true, isActive: true },
    });
  } catch {
    // DB not connected.
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Uživatelé</h1>
      <div className="mt-6">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
