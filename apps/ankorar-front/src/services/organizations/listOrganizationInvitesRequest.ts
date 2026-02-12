import { connection } from "@/services/ankorarApi/axios";

export interface OrganizationInvitePreview {
  id: string;
  email: string;
  status: string;
  created_at: string;
  organization: {
    id: string;
    name: string;
  };
  invited_by_user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ListOrganizationInvitesRequestData {
  invites: OrganizationInvitePreview[];
}

export async function listOrganizationInvitesRequest() {
  return connection.get<ListOrganizationInvitesRequestData>(
    "/v1/organizations/invites",
  );
}
