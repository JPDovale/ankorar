import { createActivationToken } from "./createActivationToken";
import { createActivationTokenForUser } from "./createActivationTokenForUser";
import { markActivationTokenAsUsed } from "./markActivationTokenAsUsed";
import { findValidActivationTokenById } from "./fns/findValidActivationTokenById";
import { persistActivationToken } from "./fns/persistActivationToken";
import { sendEmailOfActivationToUser } from "./fns/sendEmailOfActivationToUser";

const ActivationTokens = {
  create: createActivationToken,
  createForUser: createActivationTokenForUser,
  markTokenAsUsed: markActivationTokenAsUsed,
  fns: {
    persist: persistActivationToken,
    sendEmailOfActivationToUser,
    findValidById: findValidActivationTokenById,
  },
};

export { ActivationTokens };
