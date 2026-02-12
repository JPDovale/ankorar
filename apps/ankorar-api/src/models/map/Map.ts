import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { date } from "@/src/models/date";

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

interface MapProps {
  member_id: string;
  title: string;
  content: JsonValue[];
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateMapProps = Optional<
  MapProps,
  "content" | "created_at" | "updated_at" | "deleted_at"
>;

export class Map extends Entity<MapProps> {
  static create(props: CreateMapProps, id?: string) {
    const mapProps: MapProps = {
      ...props,
      title: props.title.trim(),
      content: props.content ?? [],
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newMap = new Map(mapProps, id);

    return newMap;
  }

  get member_id() {
    return this.props.member_id;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title.trim();
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: JsonValue[]) {
    this.props.content = content;
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
    this.props.deleted_at = date.nowUtcDate();
    this.touch();
  }

  touch() {
    if (this.isNewEntity) return;

    this.props.updated_at = date.nowUtcDate();
    this.update();
  }
}
