import { JsonValue, Map } from "./Map";
import { extractCentralNodeTitle } from "./fns/extractCentralNodeTitle";
import { findMapByIdAndMemberId } from "./fns/findMapByIdAndMemberId";
import { persistMap } from "./fns/persistMap";

type UpdateMapNodeContentInput = {
  id: string;
  memberId: string;
  content: JsonValue[];
};

type UpdateMapNodeContentResponse = {
  map: Map;
};

export async function updateMapNodeContent({
  id,
  memberId,
  content,
}: UpdateMapNodeContentInput): Promise<UpdateMapNodeContentResponse> {
  const { map } = await findMapByIdAndMemberId({
    id,
    memberId,
  });

  map.content = content;
  const centralNodeTitle = extractCentralNodeTitle(content);

  if (centralNodeTitle) {
    map.title = centralNodeTitle;
  }

  await persistMap({ map });

  return { map };
}
