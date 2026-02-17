import { connection } from "@/services/ankorarApi/axios";

interface CreateCheckoutSessionRequestBody {
  price_id: string;
}

interface CreateCheckoutSessionRequestData {
  url: string;
}

export async function createCheckoutSessionRequest(
  body: CreateCheckoutSessionRequestBody,
) {
  return connection.post<CreateCheckoutSessionRequestData>(
    "/v1/checkout/session",
    body,
  );
}
