import { canRequest } from "./canRequest";
import { clearSessionCookies } from "./clearSessionCookies";
import { injectAnonymousOrUser } from "./injectAnonymousOrUser";
import { setSessionCookies } from "./setSessionCookies";
import { injectAnonymousUser } from "./fns/injectAnonymousUser";
import { injectAuthenticatedUser } from "./fns/injectAuthenticatedUser";
import { injectAuthenticatedWithApiKey } from "./fns/injectAuthenticatedWithApiKey";

const Controller = {
  injectAnonymousOrUser,
  canRequest,
  setSessionCookies,
  clearSessionCookies,
  fns: {
    injectAnonymousUser,
    injectAuthenticatedUser,
    injectAuthenticatedWithApiKey,
  },
};

export { Controller };
