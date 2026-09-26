import { assertVerifyAllowed } from "@/lib/verify";

/** Marks a claim Lenka has not confirmed yet. Visible on dev/preview, fatal on live production. */
export function Verify({ label = "ověřit", children }: { label?: string; children?: React.ReactNode }) {
  assertVerifyAllowed(label);
  return (
    <>
      {children}
      <span className="ml-1 inline-block rounded-md border border-dashed border-[#8A6D00] bg-[#FFE58A] px-1.5 align-middle font-sans text-[11px] font-bold uppercase not-italic tracking-wide text-[#3D3000]">
        {label}
      </span>
    </>
  );
}
