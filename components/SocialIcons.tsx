import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { SocialLinks } from "@/lib/social";

const PLATFORMS = [
  { key: "facebook", label: "Facebook", Icon: FaFacebookF },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
] as const;

export function SocialIcons({
  links,
  variant,
  className,
}: {
  links: SocialLinks;
  variant: "header" | "footer";
  className?: string;
}) {
  const items = PLATFORMS.filter((p) => links[p.key]);
  if (items.length === 0) return null;

  const tone =
    variant === "header"
      ? "text-white hover:opacity-80"
      : "text-primary hover:text-terracotta";
  const size = variant === "header" ? 16 : 20;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {items.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={links[key] as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            tone,
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
          )}
        >
          <Icon size={size} aria-hidden />
        </a>
      ))}
    </div>
  );
}
