export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[20px] border border-[rgba(255,246,236,.16)] bg-[rgba(255,246,236,.07)] p-5">
      <b className="block text-[40px] font-semibold leading-none tracking-[-.03em] text-[#FFF6EC] tabular-nums md:text-5xl">
        {value}
      </b>
      <span className="mt-2.5 block text-sm text-[#D9BFB3]">{label}</span>
    </div>
  );
}
