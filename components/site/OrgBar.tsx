import { ORG } from "@/lib/org";
import { Container } from "./Container";

const short = (t: string) => t.replace(/:00/g, "").replace(/\s/g, "").replace(/^0/, "").replace(/–0/, "–");

/** Nonprofit identity strip at the bottom of the homepage hero (Ad Grants: mission + IČO at a glance). */
export function OrgBar() {
  return (
    <div className="absolute inset-x-0 bottom-0 text-sm text-[#FFF1E4]">
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-[rgba(255,241,228,.3)] py-5">
        <span>
          <b>{ORG.legalName}</b> · IČO {ORG.ico}
        </span>
        <span>Pomáháme od roku {ORG.since} · odpověď zpravidla do 24 hodin</span>
        <span>
          Kancelář Kralovice · {ORG.hours.map((h) => `${h.day.slice(0, 2)} ${short(h.time)}`).join(", ")}
        </span>
      </Container>
    </div>
  );
}
