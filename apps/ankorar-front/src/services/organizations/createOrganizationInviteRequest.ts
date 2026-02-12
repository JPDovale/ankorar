import { connection } from "@/services/ankorarApi/axios";

export interface CreateOrganizationInviteRequestBody {
  email: string;
}

export async function createOrganizationInviteRequest(
  payload: CreateOrganizationInviteRequestBody,
) {
  return connection.post<null>("/v1/organizations/invites", payload);
}
