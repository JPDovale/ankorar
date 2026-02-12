import { connection } from "@/services/ankorarApi/axios";

export interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function createUserRequest(payload: CreateUserRequestBody) {
  return connection.post<null>("/v1/users", payload);
}
