import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { Organization } from "@/src/models/organization/Organizations/Organization";

export async function createApiKeyForOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const result = await cryptoModule.ApiKeys.createForOrganization({
    organization,
  });
  if (!result.ok) {
    throw new Error(JSON.stringify(result.validation.error));
  }
  return { text: result.text };
}
