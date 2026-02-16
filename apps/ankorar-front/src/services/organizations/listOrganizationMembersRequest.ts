import { connection } from "@/services/ankorarApi/axios";

export type OrganizationMemberType = "member" | "invite";
export type OrganizationMemberRole = "owner" | "admin" | "member";
export type OrganizationMemberStatus = "active" | "invited";

export interface OrganizationMemberPreview {
  id: string;
  type: OrganizationMemberType;
  name: string;
  email: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
}

interface ListOrganizationMembersResponseData {
  members: OrganizationMemberPreview[];
}

export async function listOrganizationMembersRequest() {
  return connection.get<ListOrganizationMembersResponseData>(
    "/v1/organizations/members",
  );
}
