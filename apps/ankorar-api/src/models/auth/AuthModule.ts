import { Module } from "@/src/infra/shared/entities/Module";
import { Auth } from "./Auth";

interface AuthModuleProps {
  name: string;
  Auth: typeof Auth;
}

class AuthModule extends Module<AuthModuleProps> {
  static create(props: AuthModuleProps) {
    return new AuthModule(props, props.name);
  }

  get Auth() {
    return this.props.Auth;
  }
}

export const authModule = AuthModule.create({
  name: "AuthModule",
  Auth,
});
