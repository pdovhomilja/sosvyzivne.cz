import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Official SOS výživné logo (public/logo/sos-logo.svg, cropped from SOS_logo_landscape-RGB.ai). */
export function Logo() {
  return (
    <Link href="/" aria-label="SOS výživné, domů" className="flex shrink-0 items-center">
      <Image src="/logo/sos-logo.svg" alt="SOS výživné" width={440} height={92} priority className="h-8 w-auto md:h-9" />
    </Link>
  );
}
