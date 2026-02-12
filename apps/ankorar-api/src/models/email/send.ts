import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
});

interface SendProps {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export function send(props: SendProps) {
  return transport.sendMail({
    from: props.from,
    to: props.to,
    subject: props.subject,
    text: props.text,
    html: props.html,
  });
}
