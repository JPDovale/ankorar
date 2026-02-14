import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";
import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { FastifyRequest } from "fastify";
import { cryptoModule } from "../../../crypto/CryptoModule";
import { Member } from "../../../organization/Members/Member";
import { organizationModule } from "../../../organization/OrganizationModule";
import { User } from "../../../user/Users/User";

type InjectAuthenticatedWithApiKeyInput = {
  request: FastifyRequest;
};

type InjectAuthenticatedWithApiKeyResponse = Promise<void>;

export async function injectAuthenticatedWithApiKey({
  request,
}: InjectAuthenticatedWithApiKeyInput): InjectAuthenticatedWithApiKeyResponse {
  const { ApiKeys } = cryptoModule;
  const { Organizations } = organizationModule;

  if (!request.headers["x-api-key"]) {
    throw new PermissionDenied();
  }

  const api_key_text = request.headers["x-api-key"];

  if (typeof api_key_text !== "string") {
    throw new InvalidApiKey();
  }

  const { apiKey } = await ApiKeys.validate({ text: api_key_text });

  const user = User.create({
    email: "",
    name: "",
    password: "",
  });

  const { organization } = await Organizations.fns.findById({
    id: apiKey.organization_id,
  });

  const member = Member.create({
    features: apiKey.features,
    org_id: apiKey.organization_id,
    user_id: user.id,
  });

  request.context = {
    ...request.context,
    user,
    member,
    organization,
  };
}
