import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Single authorization choke point for the whole admin area.
  const session = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-surface-muted text-ink">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar email={session.user.email} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
