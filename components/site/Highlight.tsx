/** Rose highlight pill — homepage hero only. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[14px] bg-rose-2 px-[.18em] pb-[.04em] font-accent font-normal italic leading-[1.05] tracking-normal text-[#FFF6EC]">
      {children}
    </span>
  );
}
