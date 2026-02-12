import { connection } from "@/services/ankorarApi/axios";

interface RejectOrganizationInviteRequestProps {
  inviteId: string;
}

export async function rejectOrganizationInviteRequest({
  inviteId,
}: RejectOrganizationInviteRequestProps) {
  return connection.patch<null>(`/v1/organizations/invites/${inviteId}/reject`);
}
