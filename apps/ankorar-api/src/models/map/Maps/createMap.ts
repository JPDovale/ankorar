import { CreateMapProps, Map } from "./Map";
import { createCentralNode } from "./fns/createCentralNode";
import { persistMap } from "./fns/persistMap";

type CreateMapInput = CreateMapProps;

type CreateMapResponse = {
  map: Map;
};

export async function createMap(props: CreateMapInput): Promise<CreateMapResponse> {
  const map = Map.create(props);

  if (!props.content || props.content.length === 0) {
    map.content = [createCentralNode(map.title)];
  }

  await persistMap({ map });

  return { map };
}
