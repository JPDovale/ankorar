import { Module } from "@/src/infra/shared/entities/Module";
import { createActivationToken } from "./createActivationToken";
import { createActivationTokenForUser } from "./createActivationTokenForUser";
import { markActivationTokenAsUsed } from "./markActivationTokenAsUsed";
import { persistActivationToken } from "./fns/persistActivationToken";
import { sendEmailOfActivationToUser } from "./fns/sendEmailOfActivationToUser";
import { findValidActivationTokenById } from "./fns/findValidActivationTokenById";

interface ActivationModuleProps {
  name: string;
  ActivationTokens: {
    create: typeof createActivationToken;
    createForUser: typeof createActivationTokenForUser;
    markTokenAsUsed: typeof markActivationTokenAsUsed;
    fns: {
      persist: typeof persistActivationToken;
      sendEmailOfActivationToUser: typeof sendEmailOfActivationToUser;
      findValidById: typeof findValidActivationTokenById;
    };
  };
}

class ActivationModule extends Module<ActivationModuleProps> {
  static create(props: ActivationModuleProps) {
    return new ActivationModule(props, props.name);
  }

  get ActivationTokens() {
    return this.props.ActivationTokens;
  }
}

export const activationModule = ActivationModule.create({
  name: "activationModule",
  ActivationTokens: {
    create: createActivationToken,
    createForUser: createActivationTokenForUser,
    markTokenAsUsed: markActivationTokenAsUsed,

    fns: {
      persist: persistActivationToken,
      sendEmailOfActivationToUser: sendEmailOfActivationToUser,
      findValidById: findValidActivationTokenById,
    },
  },
});
