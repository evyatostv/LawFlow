import { ServerClient } from "postmark";

export async function sendOtpEmail(to: string, code: string) {
  const from = process.env.POSTMARK_FROM_EMAIL;
  const token = process.env.POSTMARK_API_TOKEN;

  if (token && from) {
    const client = new ServerClient(token);
    await client.sendEmail({
      From: from,
      To: to,
      Subject: "LawFlow קוד כניסה חד פעמי",
      TextBody: `קוד הכניסה שלך הוא ${code}. תוקף הקוד 10 דקות.`,
    });
    return;
  }

  const sendgrid = process.env.SENDGRID_API_KEY;
  const sendgridFrom = process.env.SENDGRID_FROM_EMAIL;
  if (sendgrid && sendgridFrom) {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgrid}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: sendgridFrom },
        subject: "LawFlow קוד כניסה חד פעמי",
        content: [{ type: "text/plain", value: `קוד הכניסה שלך הוא ${code}. תוקף הקוד 10 דקות.` }],
      }),
    });
    return;
  }

  throw new Error("No email provider configured");
}
