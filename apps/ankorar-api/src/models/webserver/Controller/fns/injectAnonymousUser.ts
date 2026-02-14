import { FastifyRequest } from "fastify";
import { Member } from "../../../organization/Members/Member";
import { Organization } from "../../../organization/Organizations/Organization";
import { User } from "../../../user/Users/User";

type InjectAnonymousUserInput = {
  request: FastifyRequest;
};

type InjectAnonymousUserResponse = void;

export function injectAnonymousUser({
  request,
}: InjectAnonymousUserInput): InjectAnonymousUserResponse {
  const user = User.create({
    email: "",
    name: "",
    password: "",
  });

  const organization = Organization.create({
    creator_id: user.id,
    name: "",
  });

  const member = Member.create({
    features: ["create:session", "create:user", "read:activation_token"],
    org_id: organization.id,
    user_id: user.id,
  });

  request.context = {
    ...request.context,
    user,
    member,
    organization,
  };
}
