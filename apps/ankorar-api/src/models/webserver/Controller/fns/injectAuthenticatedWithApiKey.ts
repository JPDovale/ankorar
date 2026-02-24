import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";
import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { FastifyRequest } from "fastify";
import { getPlanSlug } from "@/src/models/subscription/planConfig";
import { cryptoModule } from "../../../crypto/CryptoModule";
import { Member } from "../../../organization/Members/Member";
import { organizationModule } from "../../../organization/OrganizationModule";
import { User } from "../../../user/Users/User";
import { userModule } from "../../../user/UserModule";

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];

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

  const { organization } = await Organizations.fns.findById({
    id: apiKey.organization_id,
  });

  const { user: owner } = await userModule.Users.fns.findById({
    id: organization.creator_id,
  });

  const subscriptionActive =
    owner.subscription_status != null &&
    ACTIVE_SUBSCRIPTION_STATUSES.includes(owner.subscription_status);
  const planIsIntegration =
    getPlanSlug(owner.stripe_price_id) === "integration";

  if (!subscriptionActive || !planIsIntegration) {
    throw new PermissionDenied({
      message:
        "O uso de chave de API exige que o dono da organização tenha assinatura ativa no plano Integration.",
      action:
        "Atualize o plano da organização para Integration e garanta que a assinatura esteja ativa.",
    });
  }

  const user = User.create({
    email: "",
    name: "",
    password: "",
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
