import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { date } from "@/src/models/date";

export type OrganizationInviteStatus = "pending" | "accepted" | "rejected";

interface OrganizationInviteProps {
  organization_id: string;
  invited_by_user_id: string;
  invited_user_id: string;
  email: string;
  status: OrganizationInviteStatus;
  responded_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateOrganizationInviteProps = Optional<
  OrganizationInviteProps,
  "status" | "responded_at" | "created_at" | "updated_at" | "deleted_at"
>;

export class OrganizationInvite extends Entity<OrganizationInviteProps> {
  static create(props: CreateOrganizationInviteProps, id?: string) {
    const organizationInviteProps: OrganizationInviteProps = {
      ...props,
      email: props.email.trim().toLowerCase(),
      status: props.status ?? "pending",
      responded_at: props.responded_at ?? null,
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newOrganizationInvite = new OrganizationInvite(
      organizationInviteProps,
      id,
    );

    return newOrganizationInvite;
  }

  get organization_id() {
    return this.props.organization_id;
  }

  get invited_by_user_id() {
    return this.props.invited_by_user_id;
  }

  get invited_user_id() {
    return this.props.invited_user_id;
  }

  get email() {
    return this.props.email;
  }

  get status() {
    return this.props.status;
  }

  get responded_at() {
    return this.props.responded_at;
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

  markAsAccepted() {
    this.props.status = "accepted";
    this.props.responded_at = date.nowUtcDate();
    this.touch();
  }

  markAsRejected() {
    this.props.status = "rejected";
    this.props.responded_at = date.nowUtcDate();
    this.touch();
  }

  markAsDeleted() {
    this.props.deleted_at = date.nowUtcDate();
    this.touch();
  }

  touch() {
    if (this.isNewEntity) return;

    this.props.updated_at = date.nowUtcDate();
    this.update();
  }
}
