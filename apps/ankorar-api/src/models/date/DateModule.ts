import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Date } from "./Date";

interface DateModuleProps {
  name: string;
  Date: typeof Date;
}

export class DateModule extends Module<DateModuleProps> {
  static readonly moduleKey = "date";

  static create() {
    return new DateModule(
      {
        name: "date",
        Date,
      },
      "date",
    );
  }

  get Date() {
    return this.props.Date;
  }
}

registerModuleClass(DateModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    date: DateModule;
  }
}

export const dateModule = createModuleProxy("date");
