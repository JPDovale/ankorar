import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { buildDeepenPrompt } from "@/src/models/map/Maps/fns/buildDeepenPrompt";
import { normalizeDeepenNodesFromAi } from "@/src/models/map/Maps/fns/normalizeDeepenNodesFromAi";
import { findMapByIdAndMemberId } from "@/src/models/map/Maps/fns/findMapByIdAndMemberId";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  deepenMapNodeForMemberBody,
  deepenMapNodeForMemberParams,
  deepenMapNodeForMemberResponses,
} from "./deepenMapNodeForMember.gateway";

export const deepenMapNodeForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id/deepen-node",
  method: "post",
  tags: ["Maps"],
  summary: "Deepen a map node with AI for member",
  description:
    "Gera novos nós filhos para um nó do mapa de um membro usando IA. O crédito de IA é debitado do usuário do membro dono do mapa.",
  params: deepenMapNodeForMemberParams,
  body: deepenMapNodeForMemberBody,
  response: deepenMapNodeForMemberResponses,
  preHandler: [Route.canRequest("update:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member_id: memberId, map_id: mapId } = request.params;
    const { node, contextPath } = request.body;

    const { member } = await Members.fns.findById({ id: memberId });

    if (member.org_id !== organization.id) {
      throw new MemberNotFound();
    }

    await Users.fns.consumeAiCredit({ userId: member.user_id });

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
