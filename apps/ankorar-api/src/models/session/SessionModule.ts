import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Sessions } from "./Sessions";

interface SessionModuleProps {
  name: string;
  Sessions: typeof Sessions;
}

export class SessionModule extends Module<SessionModuleProps> {
  static readonly moduleKey = "session";

  static create() {
    return new SessionModule(
      {
        name: "session",
        Sessions,
      },
      "session",
    );
  }

  get Sessions() {
    return this.props.Sessions;
  }
}

registerModuleClass(SessionModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    session: SessionModule;
  }
}

export const sessionModule = createModuleProxy("session");
