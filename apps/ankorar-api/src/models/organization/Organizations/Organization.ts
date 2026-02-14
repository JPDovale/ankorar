import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { dateModule } from "@/src/models/date/DateModule";
import { Member } from "../Members/Member";

interface OrganizationProps {
  name: string;
  members: Member[];
  creator_id: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateOrganizationProps = Optional<
  OrganizationProps,
  "created_at" | "updated_at" | "deleted_at" | "members"
>;

export class Organization extends Entity<OrganizationProps> {
  static create(props: CreateOrganizationProps, id?: string) {
    const organizationProps: OrganizationProps = {
      ...props,
      members: props.members ?? [],
      created_at: props.created_at ?? dateModule.Date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newOrganization = new Organization(organizationProps, id);

    return newOrganization;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name.trim();
    this.touch();
  }

  get creator_id() {
    return this.props.creator_id;
  }

  get members() {
    return this.props.members;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get deleted_at() {
    return this.props.deleted_at;
  }

  markAsDeleted() {
    this.props.deleted_at = dateModule.Date.nowUtcDate();
    this.touch();
  }

  touch() {
    if (this.isNewEntity) return;
    this.props.updated_at = dateModule.Date.nowUtcDate();
    this.update();
  }
}
