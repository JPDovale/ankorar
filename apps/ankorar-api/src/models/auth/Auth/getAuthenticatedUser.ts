import { InvalidCredentials } from "@/src/infra/errors/InvalidCredentials";
import { PasswordNotDefined } from "@/src/infra/errors/PasswordNotDefined";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { safeCall } from "@/src/utils/safeCall";
import { cryptoModule } from "../../crypto/CryptoModule";
import { Member } from "../../organization/Members/Member";
import { Organization } from "../../organization/Organizations/Organization";
import { organizationModule } from "../../organization/OrganizationModule";
import { User } from "../../user/Users/User";
import { userModule } from "../../user/UserModule";

type GetAuthenticatedUserInput = {
  email: string;
  password: string;
};

type GetAuthenticatedUserResponse = {
  user: User;
  organization: Organization;
  member: Member;
};

export async function getAuthenticatedUser({
  email,
  password,
}: GetAuthenticatedUserInput): Promise<GetAuthenticatedUserResponse> {
  const { Users } = userModule;
  const { Crypto } = cryptoModule;
  const { Organizations, Members } = organizationModule;

  const userResult = await safeCall(() =>
    Users.fns.findByEmail({
      email,
    }),
  );

  if (!userResult.success) {
    if (userResult.error instanceof UserNotFound) {
      throw new InvalidCredentials();
    }

    throw userResult.error;
  }

  const { user } = userResult.data;

  if (!user.password) {
    throw new PasswordNotDefined();
  }

  const passwordMatches = await Crypto.fns.comparePassword({
    password,
    hash: user.password,
  });

  if (!passwordMatches) {
    throw new InvalidCredentials();
  }

  const { organization } = await Organizations.fns.findByCreatorId({
    id: user.id,
  });

  const { member } = await Members.fns.findByUserIdAndOrgId({
    orgId: organization.id,
    userId: user.id,
  });

  return {
    user,
    organization,
    member,
  };
}
