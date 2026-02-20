import { Route } from "@/src/infra/shared/entities/Route";
import { listUsersResponses } from "./listUsers.gateway";

export const listUsersRoute = Route.create({
  path: "/v1/users/list",
  method: "get",
  tags: ["Users"],
  summary: "List platform users",
  description:
    "Lista todos os usuários da plataforma com informações de assinatura. Requer read:user:other. Paginado.",
  response: listUsersResponses,
  preHandler: [Route.canRequest("read:user:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const raw = request.query as { limit?: number; offset?: number };
    const limit = Math.min(100, Math.max(1, Number(raw?.limit) ?? 20));
    const offset = Math.max(0, Number(raw?.offset) ?? 0);

    const { users, total } = await Users.fns.findManyPaginated({
      limit,
      offset,
    });

    return reply.status(200).send({
      status: 200,
      data: { users, total },
    });
  },
});
