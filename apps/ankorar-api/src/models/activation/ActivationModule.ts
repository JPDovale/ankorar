import { Module } from "@/src/infra/shared/entities/Module";
import { ActivationTokens } from "./ActivationTokens";

interface ActivationModuleProps {
  name: string;
  ActivationTokens: typeof ActivationTokens;
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
  ActivationTokens,
});
