import { Member } from "@/src/models/organization/Member";
import { Organization } from "@/src/models/organization/Organization";
import { User } from "@/src/models/user/User";

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
