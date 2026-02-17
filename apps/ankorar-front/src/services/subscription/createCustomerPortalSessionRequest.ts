import { connection } from "@/services/ankorarApi/axios";

interface CreateCustomerPortalSessionRequestData {
  url: string;
}

export async function createCustomerPortalSessionRequest() {
  return connection.post<CreateCustomerPortalSessionRequestData>(
    "/v1/customer-portal/session",
  );
}
