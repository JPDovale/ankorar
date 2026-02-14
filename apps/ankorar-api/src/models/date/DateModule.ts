import { Module } from "@/src/infra/shared/entities/Module";
import { Date } from "./Date";

interface DateModuleProps {
  name: string;
  Date: typeof Date;
}

class DateModule extends Module<DateModuleProps> {
  static create(props: DateModuleProps) {
    return new DateModule(props, props.name);
  }

  get Date() {
    return this.props.Date;
  }
}

export const dateModule = DateModule.create({
  name: "DateModule",
  Date,
});
