import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Auth } from "./Auth";

interface AuthModuleProps {
  name: string;
  Auth: typeof Auth;
}

export class AuthModule extends Module<AuthModuleProps> {
  static readonly moduleKey = "auth";

  static create() {
    return new AuthModule(
      {
        name: "auth",
        Auth,
      },
      "auth",
    );
  }

  get Auth() {
    return this.props.Auth;
  }
}

registerModuleClass(AuthModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    auth: AuthModule;
  }
}

export const authModule = createModuleProxy("auth");
