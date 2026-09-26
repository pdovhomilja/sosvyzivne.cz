import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { isExternalHref } from "@/lib/site/href";

type Variant = "plum" | "glass" | "cream" | "outline-cream";

const styles: Record<Variant, string> = {
  plum: "bg-plum text-[#FFF6EC] border-plum hover:bg-[#27111B]",
  glass: "bg-white/55 text-plum border-plum/35 backdrop-blur hover:bg-white/80",
  cream: "bg-cream text-plum border-cream hover:bg-white",
  "outline-cream": "bg-transparent text-cream border-cream/50 hover:bg-white/10",
};

export const buttonClass = (variant: Variant = "plum", className?: string) =>
  cn(
    "inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-6 text-base font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2F4E8C]",
    styles[variant],
    className,
  );

export function Button({
  href,
  variant = "plum",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = buttonClass(variant, className);
  return isExternalHref(href) ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
