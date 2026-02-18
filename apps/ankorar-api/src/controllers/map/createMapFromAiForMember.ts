import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import { JsonValue } from "@/src/models/map/Maps/Map";
import { buildMindMapPrompt } from "@/src/models/map/Maps/fns/buildMindMapPrompt";
import {
  deepenAllLeafNodes,
  type DeepenAllLeafNodesDeps,
} from "@/src/models/map/Maps/fns/deepenAllLeafNodes";
import { normalizeMindMapNodesFromAi } from "@/src/models/map/Maps/fns/normalizeMindMapNodesFromAi";
import {
  createMapFromAiForMemberBody,
  createMapFromAiForMemberParams,
  createMapFromAiForMemberResponses,
} from "./createMapFromAiForMember.gateway";

const DEFAULT_TITLE = "Mapa gerado";

function deriveTitle(description: string, optionalTitle?: string): string {
  const trimmed = optionalTitle?.trim();
  if (trimmed && trimmed.length > 0) {
    return trimmed.slice(0, 256);
  }
  const fromDesc = description.trim().slice(0, 256);
  return fromDesc || DEFAULT_TITLE;
}

export const createMapFromAiForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/from-ai",
  method: "post",
  tags: ["Maps"],
  summary: "Create map from AI for member",
  description:
    "Cria um mapa com conteúdo gerado por IA para um membro da organização. O crédito de IA é debitado do usuário do membro.",
  params: createMapFromAiForMemberParams,
  body: createMapFromAiForMemberBody,
  response: createMapFromAiForMemberResponses,
  preHandler: [Route.canRequest("create:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { OpenAi } = modules.openai;
    const { Users } = modules.user;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const memberId = request.params.member_id;
    const { member } = await Members.fns.findById({ id: memberId });

    if (member.org_id !== organization.id) {
      throw new MemberNotFound();
    }

    const { user } = await Users.fns.findById({ id: member.user_id });

    const limits = getPlanLimits(user.stripe_price_id);
    if (limits.max_maps !== null) {
      const { count } = await Maps.fns.countByMemberId({ memberId: member.id });
      if (count >= limits.max_maps) {
        throw new PlanLimitExceeded({
          message: `O plano do membro permite no máximo ${limits.max_maps} mapas por organização.`,
        });
      }
    }

    await Users.fns.consumeAiCredit({ userId: user.id });

    const description = request.body.description;
    const title = deriveTitle(description, request.body.title);

    const prompt = buildMindMapPrompt(description);

    const result = await OpenAi.generateJson({
      client: modules.openai.client,
      prompt,
    });

    const normalizedNodes = normalizeMindMapNodesFromAi(result.data);
    let content = normalizedNodes as JsonValue[];

    const deepenDeps: DeepenAllLeafNodesDeps = {
      generateJson: OpenAi.generateJson as DeepenAllLeafNodesDeps["generateJson"],
      client: modules.openai.client,
    };
    content = await deepenAllLeafNodes(content, deepenDeps);

    const { map } = await Maps.create({
      member_id: member.id,
      title,
      content,
      generated_by_ai: true,
    });

    return reply.status(201).send({
      status: 201,
      data: { map_id: map.id },
    });
  },
});
