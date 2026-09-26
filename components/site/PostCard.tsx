import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function PostCard({
  href,
  title,
  image,
  kicker = "Blog",
}: {
  href: string;
  title: string;
  image: { src: string; alt: string; width?: number; height?: number };
  kicker?: string;
}) {
  return (
    <Link href={href} className="group flex flex-col gap-3.5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-sand">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized={image.src.startsWith("http")}
          className="object-cover"
        />
      </div>
      <small className="text-[13px] font-bold uppercase tracking-[.12em] text-rose">{kicker}</small>
      <h3 className="text-2xl font-semibold leading-[1.15] tracking-[-.02em] text-plum group-hover:underline">{title}</h3>
    </Link>
  );
}
