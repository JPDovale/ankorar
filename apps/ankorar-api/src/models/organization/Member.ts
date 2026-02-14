import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { dateModule } from "@/src/models/date/DateModule";

interface MemberProps {
  org_id: string;
  user_id: string;
  features: string[];
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateMemberProps = Optional<
  MemberProps,
  "created_at" | "updated_at" | "deleted_at"
>;

export class Member extends Entity<MemberProps> {
  static create(props: CreateMemberProps, id?: string) {
    const MemberProps: MemberProps = {
      ...props,
      created_at: props.created_at ?? dateModule.Date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newMember = new Member(MemberProps, id);

    return newMember;
  }

  get org_id() {
    return this.props.org_id;
  }

  get user_id() {
    return this.props.user_id;
  }

  get features() {
    return this.props.features;
  }

  set features(features: string[]) {
    this.props.features = features;
    this.touch();
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
    this.props.updated_at = dateModule.Date.nowUtcDate();
    this.update();
  }
}
