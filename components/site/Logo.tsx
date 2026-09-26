import { Link } from "@/i18n/navigation";
import { Accent } from "./Accent";

export function Logo({ tone = "plum" }: { tone?: "plum" | "cream" }) {
  const ink = tone === "plum" ? "#3B1C29" : "#FBF3EA";
  const gap = tone === "plum" ? "#FBF3EA" : "#3B1C29";
  return (
    <Link
      href="/"
      aria-label="SOS výživné, domů"
      className={`flex items-center gap-2.5 whitespace-nowrap text-[21px] font-bold tracking-[-.02em] ${tone === "plum" ? "text-plum" : "text-cream"}`}
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden>
        <circle cx="20" cy="20" r="14" fill="none" stroke={ink} strokeWidth="8" />
        <path d="M20 2v8M20 30v8M2 20h8M30 20h8" stroke={gap} strokeWidth="3" />
      </svg>
      <span>
        SOS{" "}
        <span className={`text-2xl ${tone === "plum" ? "text-rose" : "text-honey"}`}>
          <Accent>výživné</Accent>
        </span>
      </span>
    </Link>
  );
}
