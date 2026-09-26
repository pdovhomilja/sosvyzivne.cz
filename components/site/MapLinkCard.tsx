/** Office location as a plain link to Mapy.cz — no embed, no JS, no third-party cookies (spec §3). */
export function MapLinkCard({ address }: { address: string }) {
  return (
    <a
      href={`https://mapy.cz/zakladni?q=${encodeURIComponent(address)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-start gap-2 rounded-3xl bg-[linear-gradient(120deg,#AEBBCC,#F2D3B0_55%,#E5A27F)] p-7 text-plum md:flex-row md:items-center md:justify-between md:p-10"
    >
      <span>
        <span className="block text-[13px] font-bold uppercase tracking-[.14em] text-rose">Kancelář Kralovice</span>
        <span className="mt-2 block text-2xl font-semibold tracking-[-.02em]">{address}</span>
      </span>
      <span className="font-semibold underline underline-offset-4 group-hover:no-underline">Otevřít na Mapy.cz →</span>
    </a>
  );
}
