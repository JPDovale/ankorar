import { connection } from "@/services/ankorarApi/axios";

export async function cancelOrganizationInviteRequest(inviteId: string) {
  return connection.delete<null>(`/v1/organizations/invites/${inviteId}`);
}
