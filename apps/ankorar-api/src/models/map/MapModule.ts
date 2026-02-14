import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Maps } from "./Maps";

interface MapModuleProps {
  name: string;
  Maps: typeof Maps;
}

export class MapModule extends Module<MapModuleProps> {
  static readonly moduleKey = "map";

  static create() {
    return new MapModule(
      {
        name: "map",
        Maps,
      },
      "map",
    );
  }

  get Maps() {
    return this.props.Maps;
  }
}

registerModuleClass(MapModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    map: MapModule;
  }
}

export const mapModule = createModuleProxy("map");
