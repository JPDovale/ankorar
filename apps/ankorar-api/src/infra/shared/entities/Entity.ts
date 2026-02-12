import { v7 as uuidv7 } from "uuid";

export class Entity<T> {
  private _id: string;
  private _isNewEntity: boolean;
  private _isUpdatedRecently: boolean;
  protected props: T;

  protected constructor(props: T, id?: string) {
    this._id = id ?? uuidv7();
    this._isNewEntity = !id;
    this._isUpdatedRecently = false;
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  forceNotNew() {
    this._isNewEntity = false;
  }

  get isNewEntity(): boolean {
    return this._isNewEntity;
  }

  get isUpdatedRecently(): boolean {
    return this._isUpdatedRecently;
  }

  protected update() {
    if (this.isNewEntity) return;
    this._isUpdatedRecently = true;
  }

  public equals(entity: Entity<unknown>): boolean {
    if (entity === this) {
      return true;
    }

    if (entity.id === this.id) {
      return true;
    }

    return false;
  }

  public toJson(): T & { id: string } {
    return {
      id: this.id,
      ...(this.props as Record<string, unknown>),
    } as T & { id: string };
  }

  public toString(): string {
    return this.toString();
  }
}
