import { Module } from "@/src/infra/shared/entities/Module";
import { Users } from "./Users";

interface UserModuleProps {
  name: string;
  Users: typeof Users;
}

class UserModule extends Module<UserModuleProps> {
  static create(props: UserModuleProps) {
    return new UserModule(props, props.name);
  }

  get Users() {
    return this.props.Users;
  }
}

export const userModule = UserModule.create({
  name: "user",
  Users,
});
