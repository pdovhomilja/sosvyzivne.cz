import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let counts = { blog: 0, faq: 0, drafts: 0, users: 0 };
  try {
    const [blog, faq, drafts, users] = await Promise.all([
      db.content.count({ where: { type: "BLOG_POST", status: "PUBLISHED" } }),
      db.content.count({ where: { type: "FAQ", status: "PUBLISHED" } }),
      db.content.count({ where: { status: "DRAFT" } }),
      db.user.count({ where: { isActive: true } }),
    ]);
    counts = { blog, faq, drafts, users };
  } catch (err) {
    console.error("[admin/dashboard] failed to load counts:", err);
  }

  const cards = [
    { label: "Publikované články", value: counts.blog },
    { label: "Publikované FAQ", value: counts.faq },
    { label: "Rozpracované (koncepty)", value: counts.drafts },
    { label: "Aktivní uživatelé", value: counts.users },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Přehled</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-[var(--radius-md)] border border-border bg-surface p-5"
          >
            <p className="text-3xl font-bold text-primary">{c.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
