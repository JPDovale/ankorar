import { createApiKey } from "./createApiKey";
import { createApiKeyForOrganization } from "./createApiKeyForOrganization";
import { deleteApiKey } from "./deleteApiKey";
import { revokeApiKey } from "./revokeApiKey";
import { validateApiKey } from "./validateApiKey";
import { computeText } from "./fns/computeText";
import { findApiKeyByIdAndOrganizationId } from "./fns/findApiKeyByIdAndOrganizationId";
import { findApiKeyByPrefix } from "./fns/findApiKeyByPrefix";
import { findApiKeysByOrganizationId } from "./fns/findApiKeysByOrganizationId";
import { generateSecret } from "./fns/generateSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";
import { hashSecret } from "./fns/hashSecret";
import { persistApiKey } from "./fns/persistApiKey";
import { safeEqualText } from "./fns/safeEqualText";

const ApiKeys = {
  create: createApiKey,
  createForOrganization: createApiKeyForOrganization,
  delete: deleteApiKey,
  revoke: revokeApiKey,
  validate: validateApiKey,
  fns: {
    persist: persistApiKey,
    findByPrefix: findApiKeyByPrefix,
    findByIdAndOrganizationId: findApiKeyByIdAndOrganizationId,
    findByOrganizationId: findApiKeysByOrganizationId,
    generateUniquePrefix,
    generateSecret,
    hashSecret,
    computeText,
    safeEqualText,
  },
};

export { ApiKeys };

