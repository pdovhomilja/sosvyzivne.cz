import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IMG, type ImageKey } from "@/lib/site/images";

export function TopicCard({ href, title, text, image }: { href: string; title: string; text: string; image: ImageKey }) {
  const img = IMG[image];
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_0_rgba(59,28,41,.06)]">
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="(max-width: 768px) 100vw, 400px"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-2.5 px-6 pb-7 pt-6">
        <h3 className="font-accent text-[38px] font-normal italic leading-none tracking-[-.01em] text-plum">{title}</h3>
        <p className="text-base text-wine-muted">{text}</p>
        <span className="text-[15px] font-semibold text-rose">Jak vám pomůžeme →</span>
      </div>
    </Link>
  );
}
