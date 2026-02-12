import { getEmailHttpUrl } from "./getEmailHttpUrl";

export async function getLastEmail() {
  const emailListResponse = await fetch(`${getEmailHttpUrl()}/messages`);
  const emails = (await emailListResponse.json()) as Array<{
    id: number;
    sender: string;
    recipients: string[];
    subject: string;
    size: string;
    created_at: string;
  }>;

  if (emails.length === 0) {
    throw new Error("No emails found");
  }

  const lastEmail = emails.pop()!;

  const emailResponse = await fetch(
    `${getEmailHttpUrl()}/messages/${lastEmail.id}.plain`,
  );
  const emailBody = await emailResponse.text();

  return {
    ...lastEmail,
    body: emailBody,
  };
}
