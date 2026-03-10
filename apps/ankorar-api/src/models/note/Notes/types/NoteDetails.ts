import { ValueObject } from "@/src/infra/shared/entities/ValueObject";

export type NoteDetailsProps = {
  id: string;
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date | null;
  can_edit: boolean;
  likes_count: number;
  liked_by_me: boolean;
};

export class NoteDetails extends ValueObject<NoteDetailsProps> {
  static create(props: NoteDetailsProps) {
    return new NoteDetails(props);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get text() {
    return this.props.text;
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
