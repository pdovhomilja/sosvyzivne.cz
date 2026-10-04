import type { EndorsementItem } from "@/lib/cms/endorsements";

/** Real client quotes from the CMS; renders nothing when none are published. */
export function Endorsements({ items }: { items: EndorsementItem[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.slice(0, 3).map((e) => (
        <figure key={e.id} className="m-0 flex flex-col gap-4 rounded-3xl bg-white p-7">
          <blockquote className="m-0 font-accent text-2xl italic leading-snug text-plum">„{e.quote}“</blockquote>
          <figcaption className="text-sm text-wine-muted">
            <b className="block text-wine">{e.name}</b>
            {[e.role, e.location].filter(Boolean).join(", ")}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
