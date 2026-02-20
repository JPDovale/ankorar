import { connection } from "@/services/ankorarApi/axios";

interface UpdateUserPasswordRequestBody {
  current_password: string;
  new_password: string;
}

export async function updateUserPasswordRequest(
  body: UpdateUserPasswordRequestBody,
) {
  return connection.patch<null>("/v1/user/password", body);
}
