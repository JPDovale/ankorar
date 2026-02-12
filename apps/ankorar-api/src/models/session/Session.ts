import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { date } from "../date";

interface SessionProps {
  user_id: string;
  refresh_token: string;
  expires_at: Date;
  updated_at: Date | null;
  created_at: Date;
}

export type CreateSessionProps = Optional<
  SessionProps,
  "created_at" | "updated_at"
>;

export class Session extends Entity<SessionProps> {
  static create(props: CreateSessionProps, id?: string) {
    const sessionProps: SessionProps = {
      ...props,
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
    };

    const newSession = new Session(sessionProps, id);

    return newSession;
  }

  get user_id() {
    return this.props.user_id;
  }

  get refresh_token() {
    return this.props.refresh_token;
  }

  set refresh_token(refresh_token: string) {
    this.props.refresh_token = refresh_token;
    this.touch();
  }

  get expires_at() {
    return this.props.expires_at;
  }

  set expires_at(expires_at: Date) {
    this.props.expires_at = expires_at;
    this.touch();
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  touch() {
    this.props.updated_at = date.nowUtcDate();
    this.update();
  }
}
