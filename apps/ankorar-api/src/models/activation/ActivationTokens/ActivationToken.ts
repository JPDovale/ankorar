import { Entity } from "@/src/infra/shared/entities/Entity";
import { Optional } from "@prisma/client/runtime/client";
import { date } from "../../date";

interface ActivationTokenProps {
  user_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date | null;
  used_at: Date | null;
}

export type CreateActivationTokenProps = Optional<
  ActivationTokenProps,
  "created_at" | "updated_at" | "used_at"
>;

export class ActivationToken extends Entity<ActivationTokenProps> {
  static create(
    props: CreateActivationTokenProps,
    id?: string,
  ): ActivationToken {
    const activationTokenProps: ActivationTokenProps = {
      ...props,
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      used_at: props.used_at ?? null,
    };

    const newActivationToken = new ActivationToken(activationTokenProps, id);

    return newActivationToken;
  }

  get user_id() {
    return this.props.user_id;
  }

  get expires_at() {
    return this.props.expires_at;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get used_at(): Date | null {
    return this.props.used_at;
  }

  set used_at(used_at: Date) {
    this.props.used_at = used_at;
    this.touch();
  }

  touch() {
    this.props.updated_at = date.nowUtcDate();
    this.update();
  }
}
