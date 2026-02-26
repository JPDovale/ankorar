import { createTransport } from "nodemailer";

const smtpUser = process.env.EMAIL_SMTP_USER;
const smtpPass =
  process.env.EMAIL_SMTP_PASSWORD ?? process.env.EMAIL_SMTP_PASS ?? "";
const hasSmtpCredentials = Boolean(smtpUser && smtpPass);

const transport = createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : 587,
  secure: false,
  ...(hasSmtpCredentials && {
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  }),
});

type SendEmailInput = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type SendEmailResponse = ReturnType<typeof transport.sendMail>;

export function sendEmail(props: SendEmailInput): SendEmailResponse {
  if (!hasSmtpCredentials) {
    return Promise.reject(
      new Error(
        "Email não configurado: defina EMAIL_SMTP_USER e EMAIL_SMTP_PASSWORD (ou EMAIL_SMTP_PASS) no ambiente.",
      ),
    ) as SendEmailResponse;
  }
  return transport.sendMail({
    from: props.from,
    to: props.to,
    subject: props.subject,
    text: props.text,
    html: props.html,
  });
}
