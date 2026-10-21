import "server-only";
export function emailConfigured() {
  return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;
}
export async function sendReset(to: string, link: string, id: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `password-reset/${id}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject: "Reset your ShopaBlock password",
      text: `You requested a new password for ShopaBlock.\n\nOpen this private link within 30 minutes:\n${link}\n\nIf you did not request this, ignore this email. Your password has not changed.`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error("EmailDeliveryError");
}
