import { ValueObject } from "@/src/infra/shared/entities/ValueObject";
import type { JsonValue } from "../Map";

export type MapDetailsProps = {
  id: string;
  title: string;
  content: JsonValue[];
  created_at: Date;
  updated_at: Date | null;
  can_edit: boolean;
  likes_count: number;
  liked_by_me: boolean;
};

export class MapDetails extends ValueObject<MapDetailsProps> {
  static create(props: MapDetailsProps) {
    return new MapDetails(props);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get can_edit() {
    return this.props.can_edit;
  }

  get likes_count() {
    return this.props.likes_count;
  }

  get liked_by_me() {
    return this.props.liked_by_me;
  }
}
