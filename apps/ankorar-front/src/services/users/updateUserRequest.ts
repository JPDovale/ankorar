import { connection } from "@/services/ankorarApi/axios";

interface UpdateUserRequestBody {
  name?: string;
  email?: string;
}

export async function updateUserRequest(body: UpdateUserRequestBody) {
  return connection.patch<null>("/v1/user", body);
}
