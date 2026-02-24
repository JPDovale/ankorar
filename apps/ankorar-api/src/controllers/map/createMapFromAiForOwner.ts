import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { Route } from "@/src/infra/shared/entities/Route";
import { JsonValue } from "@/src/models/map/Maps/Map";
import { buildMindMapPrompt } from "@/src/models/map/Maps/fns/buildMindMapPrompt";
import {
  deepenAllLeafNodes,
  type DeepenAllLeafNodesDeps,
} from "@/src/models/map/Maps/fns/deepenAllLeafNodes";
import { normalizeMindMapNodesFromAi } from "@/src/models/map/Maps/fns/normalizeMindMapNodesFromAi";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import {
  createMapFromAiForOwnerBody,
  createMapFromAiForOwnerResponses,
} from "./createMapFromAiForOwner.gateway";

const DEFAULT_TITLE = "Mapa gerado";

function deriveTitle(description: string, optionalTitle?: string): string {
  const trimmed = optionalTitle?.trim();
  if (trimmed && trimmed.length > 0) {
    return trimmed.slice(0, 256);
  }
  const fromDesc = description.trim().slice(0, 256);
  return fromDesc || DEFAULT_TITLE;
}

export const createMapFromAiForOwnerRoute = Route.create({
  path: "/v1/maps/for-owner/from-ai",
  method: "post",
  tags: ["Maps"],
  summary: "Create map from AI for owner",
  description:
    "Cria um mapa mental com conteúdo gerado por IA para o dono da organização. Requer create:map:other. O crédito de IA é debitado do usuário do owner.",
  body: createMapFromAiForOwnerBody,
  response: createMapFromAiForOwnerResponses,
  preHandler: [Route.canRequest("create:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { OpenAi } = modules.openai;
    const { Users } = modules.user;
    const { Libraries } = modules.library;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    const { user: ownerUser } = await Users.fns.findById({
      id: ownerMember.user_id,
    });

    const limits = getPlanLimits(ownerUser.stripe_price_id);
    if (limits.max_maps !== null) {
      const { count } = await Maps.fns.countByMemberId({
        memberId: ownerMember.id,
      });
      if (count >= limits.max_maps) {
        throw new PlanLimitExceeded({
          message: `O plano do dono da organização permite no máximo ${limits.max_maps} mapas.`,
        });
      }
    }

    await Users.fns.consumeAiCredit({ userId: ownerUser.id });

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
      member_id: ownerMember.id,
      title,
      content,
      generated_by_ai: true,
    });

    if (request.body.library_id) {
      await Libraries.connectMap({
        id: request.body.library_id,
        organizationId: organization.id,
        mapId: map.id,
      });
      reply.header("X-Library-Id", request.body.library_id);
    }

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
