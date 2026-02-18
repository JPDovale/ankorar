import { buildDeepenPrompt } from "@/src/models/map/Maps/fns/buildDeepenPrompt";
import { normalizeDeepenNodesFromAi } from "@/src/models/map/Maps/fns/normalizeDeepenNodesFromAi";
import {
  deepenMapNodeBody,
  deepenMapNodeParams,
  deepenMapNodeResponses,
} from "./deepenMapNode.gateway";
import { findMapByIdAndMemberId } from "@/src/models/map/Maps/fns/findMapByIdAndMemberId";
import { Route } from "@/src/infra/shared/entities/Route";

export const deepenMapNodeRoute = Route.create({
  path: "/v1/maps/:map_id/deepen-node",
  method: "post",
  tags: ["Maps"],
  summary: "Deepen a map node with AI",
  description:
    "Generates new child nodes for a given node using AI and returns them for the client to merge into the map.",
  params: deepenMapNodeParams,
  body: deepenMapNodeBody,
  response: deepenMapNodeResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const member = request.context.member;
    const { map_id: mapId } = request.params;
    const { node, contextPath } = request.body;

    await findMapByIdAndMemberId({
      id: mapId,
      memberId: member.id,
    });

    const prompt = buildDeepenPrompt(node.text, contextPath);

    const result = await modules.openai.OpenAi.generateJson({
      client: modules.openai.client,
      prompt,
    });

    const parentStyle = node.style ?? {};
    const newChildren = normalizeDeepenNodesFromAi(result.data, parentStyle);

    return reply.status(200).send({
      status: 200,
      data: { newChildren },
    });
  },
});
