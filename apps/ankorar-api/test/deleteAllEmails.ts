import { getEmailHttpUrl } from "./getEmailHttpUrl";

export async function deleteAllEmails() {
  const response = await fetch(`${getEmailHttpUrl()}/messages`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete emails: ${response.statusText}`);
  }
}
