import { Member } from "@/src/models/organization/Members/Member";
import { Organization } from "@/src/models/organization/Organizations/Organization";
import { User } from "@/src/models/user/Users/User";

declare module "fastify" {
  interface FastifyRequest {
    context: {
      user: User;
      member: Member;
      organization: Organization;
      refresh_token: string;
      access_token: string;
    };
  }
}
