import { connection } from "@/services/ankorarApi/axios";

export interface SwitchOrganizationContextRequestBody {
  organization_id: string;
}

export async function switchOrganizationContextRequest(
  payload: SwitchOrganizationContextRequestBody,
) {
  return connection.patch<null>("/v1/organizations/context", payload);
}
