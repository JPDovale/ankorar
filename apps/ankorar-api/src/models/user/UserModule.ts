import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Users } from "./Users";

interface UserModuleProps {
  name: string;
  Users: typeof Users;
}

export class UserModule extends Module<UserModuleProps> {
  static readonly moduleKey = "user";

  static create() {
    return new UserModule(
      {
        name: "user",
        Users,
      },
      "user",
    );
  }

  get Users() {
    return this.props.Users;
  }
}

registerModuleClass(UserModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    user: UserModule;
  }
}

export const userModule = createModuleProxy("user");
