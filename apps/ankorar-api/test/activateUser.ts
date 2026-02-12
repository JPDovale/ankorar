import { userModule } from "@/src/models/user/UserModule";

export async function activateUser(userId: string) {
  return await userModule.Users.activateById({ id: userId });
}
