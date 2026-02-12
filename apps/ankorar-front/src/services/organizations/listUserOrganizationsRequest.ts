import { connection } from "@/services/ankorarApi/axios";

export interface OrganizationPreview {
  id: string;
  name: string;
  role: string;
  member_id: string;
  features: string[];
  is_current: boolean;
}

interface ListUserOrganizationsRequestData {
  organizations: OrganizationPreview[];
}

export async function listUserOrganizationsRequest() {
  return connection.get<ListUserOrganizationsRequestData>("/v1/organizations");
}
