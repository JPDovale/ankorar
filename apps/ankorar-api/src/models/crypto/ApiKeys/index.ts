import { createApiKey } from "./createApiKey";
import { createApiKeyForOrganization } from "./createApiKeyForOrganization";
import { validateApiKey } from "./validateApiKey";
import { computeText } from "./fns/computeText";
import { findApiKeyByPrefix } from "./fns/findApiKeyByPrefix";
import { generateSecret } from "./fns/generateSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";
import { hashSecret } from "./fns/hashSecret";
import { persistApiKey } from "./fns/persistApiKey";
import { findApiKeysByOrganizationId } from "./fns/findApiKeysByOrganizationId";
import { safeEqualText } from "./fns/safeEqualText";

const ApiKeys = {
  create: createApiKey,
  createForOrganization: createApiKeyForOrganization,
  validate: validateApiKey,
  fns: {
    persist: persistApiKey,
    findByPrefix: findApiKeyByPrefix,
    findByOrganizationId: findApiKeysByOrganizationId,
    generateUniquePrefix,
    generateSecret,
    hashSecret,
    computeText,
    safeEqualText,
  },
};

export { ApiKeys };

