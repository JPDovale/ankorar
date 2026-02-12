import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { Organization } from "@/src/models/organization/Organization";

export async function createApiKeyForOrganization({
  organization,
}: {
  organization: Organization;
}) {
  return cryptoModule.ApiKeys.createForOrganization({ organization });
}
