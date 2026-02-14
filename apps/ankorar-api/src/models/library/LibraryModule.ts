import { Module } from "@/src/infra/shared/entities/Module";
import { Libraries } from "./Libraries";

interface LibraryModuleProps {
  name: string;
  Libraries: typeof Libraries;
}

class LibraryModule extends Module<LibraryModuleProps> {
  static create(props: LibraryModuleProps) {
    return new LibraryModule(props, props.name);
  }

  get Libraries() {
    return this.props.Libraries;
  }
}

export const libraryModule = LibraryModule.create({
  name: "LibraryModule",
  Libraries,
});
