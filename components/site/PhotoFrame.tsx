import Image from "next/image";
import { cn } from "@/lib/utils";

/** Polaroid-style framed photo. */
export function PhotoFrame({
  src,
  alt,
  width,
  height,
  sizes,
  rotate = 0,
  priority = false,
  className,
  imgClassName,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  rotate?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  caption?: string;
}) {
  return (
    <figure
      className={cn("relative m-0 rounded-md bg-[#FBF5EE] p-2 shadow-[0_24px_50px_-24px_rgba(59,28,41,.55)]", className)}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full rounded-[3px] object-cover", imgClassName)}
      />
      {caption ? (
        <figcaption className="absolute bottom-7 left-6 rounded-full bg-[rgba(251,245,238,.95)] px-3 py-1.5 text-xs font-semibold text-plum">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
