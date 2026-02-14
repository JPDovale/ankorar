import { Module } from "@/src/infra/shared/entities/Module";
import { Members } from "./Members";
import { Organizations } from "./Organizations";

interface OrganizationModuleProps {
  name: string;
  Organizations: typeof Organizations;
  Members: typeof Members;
}

class OrganizationModule extends Module<OrganizationModuleProps> {
  static create(props: OrganizationModuleProps) {
    return new OrganizationModule(props, props.name);
  }

  get Organizations() {
    return this.props.Organizations;
  }

  get Members() {
    return this.props.Members;
  }
}

export const organizationModule = OrganizationModule.create({
  name: "organization",
  Organizations,
  Members,
});
