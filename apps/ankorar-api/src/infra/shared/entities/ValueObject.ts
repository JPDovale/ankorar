export class ValueObject<T> {
  protected props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  public equals(valueObject: ValueObject<unknown>): boolean {
    if (valueObject === this) {
      return true;
    }

    if (JSON.stringify(valueObject.props) === JSON.stringify(this.props)) {
      return true;
    }

    return false;
  }

  public toJson(): T {
    return {
      ...(this.props as Record<string, unknown>),
    } as T;
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
