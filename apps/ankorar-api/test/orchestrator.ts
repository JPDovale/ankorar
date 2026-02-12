import { waitForAllServices } from "./waitForAllServices";
import { createUser } from "./createUser";
import { deleteAllEmails } from "./deleteAllEmails";
import { getLastEmail } from "./getLastEmail";
import { resetDatabase } from "./resetDatabase";
import { extractUUID } from "./extractUUID";
import { activateUser } from "./activateUser";
import { createSession } from "./createSession";
import { getCookieString } from "./getCookieString";
import { deleteUser } from "./deleteUser";
import { createApiKeyForOrganization } from "./createApiKeyForOrganization";

const orchestrator = {
  deleteAllEmails,
  resetDatabase,
  getLastEmail,
  waitForAllServices,
  createUser,
  extractUUID,
  activateUser,
  createSession,
  getCookieString,
  deleteUser,
  createApiKeyForOrganization,
};

export { orchestrator };
