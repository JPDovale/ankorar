import { Module } from "@/src/infra/shared/entities/Module";
import { Maps } from "./Maps";

interface MapModuleProps {
  name: string;
  Maps: typeof Maps;
}

class MapModule extends Module<MapModuleProps> {
  static create(props: MapModuleProps) {
    return new MapModule(props, props.name);
  }

  get Maps() {
    return this.props.Maps;
  }
}

export const mapModule = MapModule.create({
  name: "MapModule",
  Maps,
});
