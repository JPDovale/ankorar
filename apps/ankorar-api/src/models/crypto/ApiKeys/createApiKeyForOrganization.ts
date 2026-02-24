import { Organization } from "../../organization/Organizations/Organization";
import { ApiKey } from "./ApiKey";
import { createApiKey } from "./createApiKey";
import { generateSecret } from "./fns/generateSecret";
import { hashSecret } from "./fns/hashSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";
import { organizationApiKeyFeatures } from "../../auth/Auth/fns/availableFeatures";

type CreateApiKeyForOrganizationInput = {
  organization: Organization;
  rawExpiresAt?: string | null;
  rawFeatures?: string[];
};

type ValidationError = {
  status: 400;
  error: { name: string; message: string; action: string };
};

type CreateApiKeyForOrganizationSuccess = {
  ok: true;
  apiKey: ApiKey;
  text: string;
};

type CreateApiKeyForOrganizationError = {
  ok: false;
  validation: ValidationError;
};

export type CreateApiKeyForOrganizationResponse =
  | CreateApiKeyForOrganizationSuccess
  | CreateApiKeyForOrganizationError;

export async function createApiKeyForOrganization({
  organization,
  rawExpiresAt,
  rawFeatures,
}: CreateApiKeyForOrganizationInput): Promise<CreateApiKeyForOrganizationResponse> {
  let expires_at: Date | null = null;
  if (rawExpiresAt && rawExpiresAt.trim() !== "") {
    const parsed = new Date(rawExpiresAt);
    if (Number.isNaN(parsed.getTime())) {
      return {
        ok: false,
        validation: {
          status: 400,
          error: {
            name: "ValidationError",
            message: "Data de expiração inválida.",
            action: "Use uma data no formato ISO (ex: 2026-12-31).",
          },
        },
      };
    }
    expires_at = parsed;
  }

  let features: string[] | undefined;
  if (Array.isArray(rawFeatures) && rawFeatures.length > 0) {
    const allowed = new Set<string>(organizationApiKeyFeatures);
    const invalid = rawFeatures.filter(
      (f: string) => typeof f !== "string" || !allowed.has(f),
    );
    if (invalid.length > 0) {
      return {
        ok: false,
        validation: {
          status: 400,
          error: {
            name: "ValidationError",
            message: "Uma ou mais features são inválidas.",
            action:
              "Use GET /v1/organizations/api_keys/available_features para listar as permitidas.",
          },
        },
      };
    }
    features = rawFeatures;
  }

  const secret = generateSecret();
  const hashedSecret = hashSecret({ secret });
  const prefix = generateUniquePrefix();
  const resolvedFeatures =
    features?.length ? features : [...organizationApiKeyFeatures];

  const { apiKey } = await createApiKey({
    organization_id: organization.id,
    prefix,
    secret: hashedSecret,
    features: resolvedFeatures,
    expires_at: expires_at ?? null,
  });

  const text = apiKey.getCompleteApiKey(secret);

  return { ok: true, apiKey, text };
}
