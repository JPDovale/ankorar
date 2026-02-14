import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Libraries } from "./Libraries";

interface LibraryModuleProps {
  name: string;
  Libraries: typeof Libraries;
}

export class LibraryModule extends Module<LibraryModuleProps> {
  static readonly moduleKey = "library";

  static create() {
    return new LibraryModule(
      {
        name: "library",
        Libraries,
      },
      "library",
    );
  }

  get Libraries() {
    return this.props.Libraries;
  }
}

registerModuleClass(LibraryModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    library: LibraryModule;
  }
}

export const libraryModule = createModuleProxy("library");
