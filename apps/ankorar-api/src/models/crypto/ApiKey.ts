import { Entity } from "@/src/infra/shared/entities/Entity";
import { date } from "../date";
import { Optional } from "@/src/infra/http/types/optional";

interface ApiKeyProps {
  features: string[];
  env: "live" | "test";
  secret: string;
  prefix: string;
  created_at: Date;
  organization_id: string;
  last_used_at: Date;
  revoked_at: Date | null;
  expires_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateApiKeyProps = Optional<
  ApiKeyProps,
  | "created_at"
  | "updated_at"
  | "env"
  | "last_used_at"
  | "revoked_at"
  | "expires_at"
  | "deleted_at"
>;

export class ApiKey extends Entity<ApiKeyProps> {
  static create(props: CreateApiKeyProps, id?: string): ApiKey {
    const activationTokenProps: ApiKeyProps = {
      ...props,
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      env: props.env ?? "live",
      last_used_at: props.last_used_at ?? date.nowUtcDate(),
      revoked_at: props.revoked_at ?? null,
      expires_at: props.expires_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newApiKey = new ApiKey(activationTokenProps, id);

    return newApiKey;
  }

  get features() {
    return this.props.features;
  }

  get env() {
    return this.props.env;
  }

  get prefix() {
    return this.props.prefix;
  }

  get secret() {
    return this.props.secret;
  }

  get created_at() {
    return this.props.created_at;
  }

  get organization_id() {
    return this.props.organization_id;
  }

  get last_used_at(): Date {
    return this.props.last_used_at;
  }

  set last_used_at(last_used_at: Date) {
    this.props.last_used_at = last_used_at;
    this.touch();
  }

  get revoked_at() {
    return this.props.revoked_at;
  }

  get expires_at() {
    return this.props.expires_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get deleted_at() {
    return this.props.deleted_at;
  }

  getCompleteApiKey(secret: string) {
    return "ak_org_" + this.env + "_" + this.prefix + "_" + secret;
  }

  touch() {
    this.props.updated_at = date.nowUtcDate();
    this.update();
  }
}
