export const mailEnabled = () => !!(process.env.RESEND_API_KEY || process.env.BREVO_API_KEY);

async function sendMail(to, subject, html) {
  const from = process.env.MAIL_FROM;
  if (!from) return false;
  try {
    const r = process.env.RESEND_API_KEY
      ? await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: `Regulus <${from}>`, to, subject, html }) })
      : await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" }, body: JSON.stringify({ sender: { name: "Regulus", email: from }, to: [{ email: to }], subject, htmlContent: html }) });
    return r.ok;
  } catch { return false; }
}
const wrap = (intro, btn, url, note) => `<div style="font-family:Arial,sans-serif;max-width:480px"><h2>Regulus</h2><p>${intro}</p><p><a href="${url}" style="background:#ffb52e;color:#14213d;padding:12px 22px;border-radius:10px;font-weight:bold;text-decoration:none">${btn}</a></p><p>Tugma işlamasa, havolani brauzerga qöying:<br>${url}</p><p>${note}</p></div>`;

export async function sendVerification(email, token) {
  const base = process.env.APP_URL;
  if (!base) return false;
  const url = `${base}/api/verify?t=${encodeURIComponent(token)}`;
  return sendMail(email, "Regulus: e-poçtani tasdiqlang", wrap("Hisobingizni tasdiqlaş uçun tugmani bosing:", "E-poçtani tasdiqlaş", url, "Havola 24 soat amal qiladi. Agar siz röyxatdan ötmagan bölsangiz, bu xatni etiborsiz qoldiring."));
}
export async function sendReset(email, token) {
  const base = process.env.APP_URL;
  if (!base) return false;
  const url = `${base}/reset?t=${encodeURIComponent(token)}`;
  return sendMail(email, "Regulus: parolni tiklaş", wrap("Parolni tiklaş uçun tugmani bosing:", "Parolni tiklaş", url, "Havola 1 soat amal qiladi. Agar siz söramagan bölsangiz, bu xatni etiborsiz qoldiring."));
}
