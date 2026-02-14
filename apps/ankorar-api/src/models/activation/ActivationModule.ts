import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { ActivationTokens } from "./ActivationTokens";

interface ActivationModuleProps {
  name: string;
  ActivationTokens: typeof ActivationTokens;
}

export class ActivationModule extends Module<ActivationModuleProps> {
  static readonly moduleKey = "activation";

  static create() {
    return new ActivationModule(
      {
        name: "activation",
        ActivationTokens,
      },
      "activation",
    );
  }

  get ActivationTokens() {
    return this.props.ActivationTokens;
  }
}

registerModuleClass(ActivationModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    activation: ActivationModule;
  }
}

export const activationModule = createModuleProxy("activation");
