export function generateOTPEmail({
  recipientName,
  otp,
}: {
  recipientName: string;
  otp: string;
}): { subject: string; html: string; text: string } {
  const subject = "Přihlašovací kód do administrace SOS výživné";
  const text = `Dobrý den ${recipientName},\n\nVáš přihlašovací kód je: ${otp}\n\nKód je platný 5 minut. Pokud jste o přihlášení nežádali, tento e-mail ignorujte.`;
  const html = `
  <div style="font-family:'Open Sans',Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#2A2320">
    <h1 style="font-family:'Playfair Display',Georgia,serif;color:#CD625D;font-size:22px">SOS výživné</h1>
    <p>Dobrý den ${recipientName},</p>
    <p>Váš přihlašovací kód do administrace:</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:6px;color:#D3578D;margin:24px 0">${otp}</p>
    <p style="color:#6B5F5A;font-size:14px">Kód je platný 5 minut. Pokud jste o přihlášení nežádali, tento e-mail ignorujte.</p>
  </div>`;
  return { subject, html, text };
}
