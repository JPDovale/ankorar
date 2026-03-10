import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { dateModule } from "@/src/models/date/DateModule";

interface NoteProps {
  member_id: string;
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateNoteProps = Optional<
  NoteProps,
  "created_at" | "updated_at" | "deleted_at"
>;

export class Note extends Entity<NoteProps> {
  static create(props: CreateNoteProps, id?: string) {
    const noteProps: NoteProps = {
      ...props,
      title: props.title.trim(),
      text: props.text ?? "",
      created_at: props.created_at ?? dateModule.Date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newNote = new Note(noteProps, id);

    return newNote;
  }

  get member_id() {
    return this.props.member_id;
  }

  get title(): string {
    return this.props.title;
  }

  set title(value: string | undefined) {
    if (value !== undefined) {
      this.props.title = value.trim();
      this.touch();
    }
  }

  get text(): string {
    return this.props.text;
  }

  set text(value: string | undefined) {
    if (value !== undefined) {
      this.props.text = value;
      this.touch();
    }
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
    if (this.isNewEntity) return;

    this.props.updated_at = dateModule.Date.nowUtcDate();
    this.update();
  }
}
