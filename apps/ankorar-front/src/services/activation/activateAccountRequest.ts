import { connection } from "@/services/ankorarApi/axios";

export async function activateAccountRequest(tokenId: string) {
  return connection.patch<null>(`/v1/activations/${tokenId}`);
}
