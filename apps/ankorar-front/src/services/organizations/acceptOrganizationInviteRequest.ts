import { connection } from "@/services/ankorarApi/axios";

interface AcceptOrganizationInviteRequestProps {
  inviteId: string;
}

export async function acceptOrganizationInviteRequest({
  inviteId,
}: AcceptOrganizationInviteRequestProps) {
  return connection.patch<null>(`/v1/organizations/invites/${inviteId}/accept`);
}
