import { connection } from "@/services/ankorarApi/axios";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string | null;
}

export type Feature = string;

interface GetUserRequestData {
  user: User;
  features: Feature[];
}

export async function getUserRequest() {
  return connection.get<GetUserRequestData>("/v1/users");
}
