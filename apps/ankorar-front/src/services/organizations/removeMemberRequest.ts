import { connection } from "@/services/ankorarApi/axios";

export async function removeMemberRequest(memberId: string) {
  return connection.delete<null>(`/v1/organizations/members/${memberId}`);
}
