import { connection } from "@/services/ankorarApi/axios";

export async function logoutRequest() {
  return connection.delete<null>("/v1/sessions");
}
