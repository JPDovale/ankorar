import { Module } from "@/src/infra/shared/entities/Module";
import { Sessions } from "./Sessions";

interface SessionModuleProps {
  name: string;
  Sessions: typeof Sessions;
}

class SessionModule extends Module<SessionModuleProps> {
  static create(props: SessionModuleProps) {
    return new SessionModule(props, props.name);
  }

  get Sessions() {
    return this.props.Sessions;
  }
}

export const sessionModule = SessionModule.create({
  name: "SessionModule",
  Sessions,
});
