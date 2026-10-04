export function NoteChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3.5 py-1.5 text-sm font-semibold text-plum backdrop-blur">
      {children}
    </span>
  );
}
