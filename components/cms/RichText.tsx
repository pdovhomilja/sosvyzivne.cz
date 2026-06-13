import { cn } from "@/lib/utils";

/**
 * Renders CMS body HTML (TipTap output).
 * TODO: sanitize server-side (e.g. with a allowlist sanitizer) before launch —
 * body is admin-authored so risk is low, but defense-in-depth is cheap.
 */
export function RichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn("prose-cms", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
