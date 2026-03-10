import { ValueObject } from "@/src/infra/shared/entities/ValueObject";

export type NotePreviewProps = {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date | null;
  likes_count: number;
};

export class NotePreview extends ValueObject<NotePreviewProps> {
  static create(props: NotePreviewProps) {
    return new NotePreview(props);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get likes_count() {
    return this.props.likes_count;
  }
}
