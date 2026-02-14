import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { Organization } from "@/src/models/organization/Organizations/Organization";

export async function createApiKeyForOrganization({
  organization,
}: {
  organization: Organization;
}) {
  return cryptoModule.ApiKeys.createForOrganization({ organization });
}
