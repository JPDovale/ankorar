import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Notes } from "./Notes";

interface NoteModuleProps {
  name: string;
  Notes: typeof Notes;
}

export class NoteModule extends Module<NoteModuleProps> {
  static readonly moduleKey = "note";

  static create() {
    return new NoteModule(
      {
        name: "note",
        Notes,
      },
      "note",
    );
  }

  get Notes() {
    return this.props.Notes;
  }
}

registerModuleClass(NoteModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    note: NoteModule;
  }
}

export const noteModule = createModuleProxy("note");
