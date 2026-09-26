export function SectionHead({
  label,
  title,
  intro,
  action,
  as: Tag = "h2",
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
      <div>
        <span className="text-[13px] font-bold uppercase tracking-[.14em] text-rose">{label}</span>
        <Tag className="mt-3 max-w-[16ch] text-4xl font-semibold leading-[1.02] tracking-[-.03em] text-balance text-plum md:text-[58px] [&_.font-accent]:text-rose">
          {title}
        </Tag>
      </div>
      {intro ? <p className="max-w-[40ch] text-wine-muted">{intro}</p> : null}
      {action}
    </div>
  );
}
