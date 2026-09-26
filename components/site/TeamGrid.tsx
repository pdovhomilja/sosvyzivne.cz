import { TEAM } from "@/lib/content/team";
import { IMG } from "@/lib/site/images";
import { PhotoFrame } from "./PhotoFrame";

export function TeamGrid() {
  return (
    <div className="grid grid-cols-2 gap-[18px] md:grid-cols-3 lg:grid-cols-6">
      {TEAM.map((t, i) => {
        const img = IMG[t.image];
        return (
          <figure key={t.name} className="m-0 grid gap-3">
            <PhotoFrame
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="200px"
              rotate={i % 2 ? 1.5 : -1.5}
              className="aspect-[4/5] p-1.5"
              imgClassName="object-[50%_20%] grayscale sepia-[.18]"
            />
            <figcaption>
              <b className="block text-[15px] leading-tight tracking-[-.01em] text-plum">{t.name}</b>
              <small className="block text-[13px] leading-snug text-wine-muted">{t.role}</small>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
