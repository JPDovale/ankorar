import { connection } from "@/services/ankorarApi/axios";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string | null;
}

interface GetUserRequestData {
  user: User;
}

export async function getUserRequest() {
  return connection.get<GetUserRequestData>("/v1/users");
}
