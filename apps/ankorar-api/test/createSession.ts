import { sessionModule } from "@/src/models/session/SessionModule";
import { User } from "@/src/models/user/Users/User";

export async function createSession(props: { user: User }) {
  return await sessionModule.Sessions.createForUser(props);
}
