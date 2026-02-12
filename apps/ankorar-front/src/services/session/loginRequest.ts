import { connection } from "@/services/ankorarApi/axios";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export async function loginRequest(payload: LoginRequestBody) {
  return connection.post<null>("/v1/sessions", payload);
}
