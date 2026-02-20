import { connection } from "@/services/ankorarApi/axios";

export interface CreateOrganizationRequestBody {
  name: string;
}

export interface CreateOrganizationResponseData {
  organization_id: string;
  name: string;
}

export async function createOrganizationRequest(
  payload: CreateOrganizationRequestBody,
) {
  return connection.post<CreateOrganizationResponseData>(
    "/v1/organizations",
    payload,
  );
}
