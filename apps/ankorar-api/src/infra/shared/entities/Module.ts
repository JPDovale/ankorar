export class Module<T> {
  private _name: string;
  protected props: T;

  protected constructor(props: T, name: string) {
    this._name = name;
    this.props = props;
  }

  get id(): string {
    return this._name;
  }

  public equals(module: Module<unknown>): boolean {
    if (module === this) {
      return true;
    }

    if (module.id === this.id) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.toString();
  }
}
