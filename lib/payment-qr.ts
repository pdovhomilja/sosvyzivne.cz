import QRCode from "qrcode";

/** Convert a Czech domestic account "prefix-number/bank" to IBAN. */
export function accountToIban(account: string): string {
  const [main, bank] = account.split("/");
  if (!bank) throw new Error(`Missing bank code in account: ${account}`);
  const [prefixRaw, numberRaw] = main.includes("-")
    ? main.split("-")
    : ["0", main];
  const prefix = prefixRaw.padStart(6, "0");
  const number = numberRaw.padStart(10, "0");
  const bankCode = bank.padStart(4, "0");
  const bban = `${bankCode}${prefix}${number}`; // 20 digits

  // mod-97 over (bban + "CZ00"), letters → numbers (C=12, Z=35)
  const rearranged = `${bban}123500`; // CZ -> 1235, "00" check placeholder
  const checkNum = 98 - mod97(rearranged);
  const check = checkNum.toString().padStart(2, "0");
  return `CZ${check}${bban}`;
}

/** Build a SPD (spayd) string for a donation, no fixed amount. */
export function buildSpd(account: string, message: string): string {
  const iban = accountToIban(account);
  // `*` is the SPD field delimiter and newlines break the record — strip both
  // so an arbitrary message can never malform the QR payload.
  const safeMessage = message.replace(/[*\r\n]/g, " ").trim();
  return `SPD*1.0*ACC:${iban}*CC:CZK*MSG:${safeMessage}`;
}

/** Render the donation QR as an inline SVG string (server-side). */
export async function donationQrSvg(
  account: string,
  message: string,
): Promise<string> {
  const spd = buildSpd(account, message);
  return QRCode.toString(spd, { type: "svg", margin: 1, width: 160 });
}

/** Validate an IBAN via mod-97 (returns true if checksum == 1). */
export function isValidIban(iban: string): boolean {
  const moved = iban.slice(4) + iban.slice(0, 4);
  const numeric = moved
    .split("")
    .map((c) => (/[A-Z]/.test(c) ? (c.charCodeAt(0) - 55).toString() : c))
    .join("");
  return mod97(numeric) === 1;
}

function mod97(numeric: string): number {
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder;
}
