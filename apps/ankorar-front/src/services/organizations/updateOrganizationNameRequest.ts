import { connection } from "@/services/ankorarApi/axios";

interface UpdateOrganizationNameRequestBody {
  name: string;
}

export async function updateOrganizationNameRequest(
  body: UpdateOrganizationNameRequestBody,
) {
  return connection.patch<null>("/v1/organizations/identity", body);
}
