/** Italic serif accent phrase — at most one per heading. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-accent font-normal italic tracking-normal">{children}</span>;
}
