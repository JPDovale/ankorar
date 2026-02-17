import { ValueObject } from "@/src/infra/shared/entities/ValueObject";

export type LibraryPreviewMapItem = {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date | null;
  likes_count: number;
  liked_by_me: boolean;
  preview: string | null;
  generated_by_ai: boolean;
};

export type LibraryPreviewProps = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date | null;
  maps: LibraryPreviewMapItem[];
};

export class LibraryPreview extends ValueObject<LibraryPreviewProps> {
  static create(props: LibraryPreviewProps) {
    return new LibraryPreview(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get maps() {
    return this.props.maps;
  }
}
