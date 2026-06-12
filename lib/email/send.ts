type EmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(input: EmailInput) {
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSmtp) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Prepwise email] To: ${input.to}\nSubject: ${input.subject}\n${input.text}`);
    }

    return { delivered: false };
  }

  // Keep SMTP optional so the open-source app deploys without paid services.
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Prepwise AI <no-reply@prepwise.local>",
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  return { delivered: true };
}
