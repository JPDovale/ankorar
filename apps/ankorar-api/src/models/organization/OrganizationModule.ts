import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Members } from "./Members";
import { Organizations } from "./Organizations";

interface OrganizationModuleProps {
  name: string;
  Organizations: typeof Organizations;
  Members: typeof Members;
}

export class OrganizationModule extends Module<OrganizationModuleProps> {
  static readonly moduleKey = "organization";

  static create() {
    return new OrganizationModule(
      {
        name: "organization",
        Organizations,
        Members,
      },
      "organization",
    );
  }

  get Organizations() {
    return this.props.Organizations;
  }

  get Members() {
    return this.props.Members;
  }
}

registerModuleClass(OrganizationModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    organization: OrganizationModule;
  }
}

export const organizationModule = createModuleProxy("organization");
