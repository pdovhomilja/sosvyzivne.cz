import { accountToIban, buildSpd, isValidIban } from "@/lib/payment-qr";
import { ORG } from "@/lib/org";

const iban = accountToIban(ORG.donationAccount);
console.log("Account:", ORG.donationAccount);
console.log("IBAN:   ", iban);
console.log("SPD:    ", buildSpd(ORG.donationAccount, "Dar SOS vyzivne"));

if (iban.length !== 24) throw new Error(`IBAN length != 24: ${iban}`);
if (!iban.startsWith("CZ")) throw new Error(`IBAN not CZ: ${iban}`);
if (!isValidIban(iban)) throw new Error(`IBAN failed mod-97 check: ${iban}`);

console.log("✓ IBAN is structurally valid (mod-97 == 1)");
