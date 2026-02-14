import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Email } from "./Email";

interface EmailModuleProps {
  name: string;
  Email: typeof Email;
}

export class EmailModule extends Module<EmailModuleProps> {
  static readonly moduleKey = "email";

  static create() {
    return new EmailModule(
      {
        name: "email",
        Email,
      },
      "email",
    );
  }

  get Email() {
    return this.props.Email;
  }
}

registerModuleClass(EmailModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    email: EmailModule;
  }
}

export const emailModule = createModuleProxy("email");
