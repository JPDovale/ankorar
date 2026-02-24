import { buildDeepenPrompt } from "@/src/models/map/Maps/fns/buildDeepenPrompt";
import { normalizeDeepenNodesFromAi } from "@/src/models/map/Maps/fns/normalizeDeepenNodesFromAi";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  deepenMapNodeForOwnerBody,
  deepenMapNodeForOwnerParams,
  deepenMapNodeForOwnerResponses,
} from "./deepenMapNodeForOwner.gateway";

export const deepenMapNodeForOwnerRoute = Route.create({
  path: "/v1/maps/for-owner/:map_id/deepen-node",
  method: "post",
  tags: ["Maps"],
  summary: "Deepen a map node with AI for owner",
  description:
    "Gera novos nós filhos para um nó do mapa do owner da organização usando IA. Requer update:map:other.",
  params: deepenMapNodeForOwnerParams,
  body: deepenMapNodeForOwnerBody,
  response: deepenMapNodeForOwnerResponses,
  preHandler: [Route.canRequest("update:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { Maps } = modules.map;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { map_id: mapId } = request.params;
    const { node, contextPath } = request.body;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    await Users.fns.consumeAiCredit({ userId: organization.creator_id });

    await Maps.fns.findDetailsByIdAndMemberId({
      id: mapId,
      ownerMemberId: ownerMember.id,
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
