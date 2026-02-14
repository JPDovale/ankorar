import { User } from "@/src/models/user/Users/User";
import { userModule } from "@/src/models/user/UserModule";

export async function deleteUser(props: { user: User }) {
  return await userModule.Users.delete(props);
}
