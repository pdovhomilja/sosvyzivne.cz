import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  className,
  muted,
  children,
}: {
  className?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "py-12 sm:py-16 lg:py-20",
        muted && "bg-surface-muted",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
