"use client";
import { LayoutDashboard, FileText, Image, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Přehled", icon: LayoutDashboard },
  { href: "/content", label: "Obsah", icon: FileText },
  { href: "/media", label: "Média", icon: Image },
  { href: "/users", label: "Uživatelé", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface">
      <div className="p-4 font-heading text-lg font-bold text-accent">
        SOS výživné
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm",
                active
                  ? "bg-secondary-tint text-accent"
                  : "text-ink hover:bg-surface-muted",
              )}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
