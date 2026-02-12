import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { date } from "@/src/models/date";

interface LibraryProps {
  organization_id: string;
  name: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export type CreateLibraryProps = Optional<
  LibraryProps,
  "created_at" | "updated_at" | "deleted_at"
>;

export class Library extends Entity<LibraryProps> {
  static create(props: CreateLibraryProps, id?: string) {
    const libraryProps: LibraryProps = {
      ...props,
      name: props.name.trim(),
      created_at: props.created_at ?? date.nowUtcDate(),
      updated_at: props.updated_at ?? null,
      deleted_at: props.deleted_at ?? null,
    };

    const newLibrary = new Library(libraryProps, id);

    return newLibrary;
  }

  get organization_id() {
    return this.props.organization_id;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name.trim();
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
