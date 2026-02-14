import { Module } from "@/src/infra/shared/entities/Module";
import { Email } from "./Email";

interface EmailModuleProps {
  name: string;
  Email: typeof Email;
}

class EmailModule extends Module<EmailModuleProps> {
  static create(props: EmailModuleProps) {
    return new EmailModule(props, props.name);
  }

  get Email() {
    return this.props.Email;
  }
}

export const emailModule = EmailModule.create({
  name: "EmailModule",
  Email,
});
