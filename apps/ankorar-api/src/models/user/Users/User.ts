import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { dateModule } from "@/src/models/date/DateModule";

interface UserProps {
  name: string;
  email: string;
  ext_id: string | null;
  password: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string | null;
  ai_credits: number;
  ai_credits_reset_at: Date | null;
}

export type CreateUserProps = Optional<
  UserProps,
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "password"
  | "ext_id"
  | "stripe_customer_id"
  | "stripe_subscription_id"
  | "stripe_price_id"
  | "subscription_status"
  | "ai_credits"
  | "ai_credits_reset_at"
>;

export class User extends Entity<UserProps> {
  static create(props: CreateUserProps, id?: string) {
    const userProps: UserProps = {
      ...props,
      email: props.email.toLowerCase(),
      ext_id: props.ext_id ?? null,
      password: props.password ?? null,
      created_at: props.created_at ?? dateModule.Date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
      stripe_customer_id: props.stripe_customer_id ?? null,
      stripe_subscription_id: props.stripe_subscription_id ?? null,
      stripe_price_id: props.stripe_price_id ?? null,
      subscription_status: props.subscription_status ?? null,
      ai_credits: props.ai_credits ?? 0,
      ai_credits_reset_at: props.ai_credits_reset_at ?? null,
    };

    const newUser = new User(userProps, id);

    return newUser;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string | undefined) {
    if (!name) return;
    this.props.name = name.trim();
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string | undefined) {
    if (!email) return;
    this.props.email = email.toLowerCase().trim();
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string | null | undefined) {
    if (password === undefined) return;
    this.props.password = password;
    this.touch();
  }

  get ext_id() {
    return this.props.ext_id;
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

  get stripe_customer_id() {
    return this.props.stripe_customer_id;
  }

  set stripe_customer_id(value: string | null | undefined) {
    if (value === undefined) return;
    this.props.stripe_customer_id = value;
    this.touch();
  }

  get stripe_subscription_id() {
    return this.props.stripe_subscription_id;
  }

  get stripe_price_id() {
    return this.props.stripe_price_id;
  }

  get subscription_status() {
    return this.props.subscription_status;
  }

  get ai_credits() {
    return this.props.ai_credits;
  }

  set ai_credits(value: number | undefined) {
    if (value === undefined) return;
    this.props.ai_credits = value;
    this.touch();
  }

  get ai_credits_reset_at() {
    return this.props.ai_credits_reset_at;
  }

  set ai_credits_reset_at(value: Date | null | undefined) {
    if (value === undefined) return;
    this.props.ai_credits_reset_at = value;
    this.touch();
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
