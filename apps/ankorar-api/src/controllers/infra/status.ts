import { db } from "@/src/infra/database/pool";
import { Route } from "@/src/infra/shared/entities/Route";
import { statusResponses } from "./status.gateways";

export const statusRoute = Route.create({
  path: "/v1/status",
  method: "get",
  tags: ["Utils"],
  summary: "Status of services",
  description: "Returns a status and health of services",
  response: statusResponses,
  handler: async (_, reply, { modules }) => {
    const updatedAt = modules.date.Date.nowUtcIso();

    const [{ total_connections: databaseOpenedConnections }] =
      await db.$queryRaw<
        Array<{ total_connections: number }>
      >`SELECT COUNT(*)::int AS total_connections FROM pg_stat_activity`;

    const [{ max_connections: databaseMaxConnections }] = await db.$queryRaw<
      Array<{ max_connections: string }>
    >`SHOW max_connections`;

    const [{ server_version: databaseVersion }] = await db.$queryRaw<
      Array<{ server_version: string }>
    >`SHOW server_version`;

    return reply.status(200).send({
      status: 200,
      data: {
        updated_at: updatedAt,
        dependencies: {
          database: {
            version: String(databaseVersion),
            max_connections: parseInt(databaseMaxConnections),
            opened_connections: databaseOpenedConnections,
          },
        },
      },
    });
  },
});
