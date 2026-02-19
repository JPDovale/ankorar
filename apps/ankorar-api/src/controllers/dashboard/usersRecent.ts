import { Route } from "@/src/infra/shared/entities/Route";
import {
  getUsersRecentCounts,
  getUsersRecentList,
} from "@/src/models/dashboard/getUsersRecent";
import { usersRecentQuery, usersRecentResponse } from "./usersRecent.gateway";

export const dashboardUsersRecentRoute = Route.create({
  path: "/v1/dashboard/metrics/users-recent",
  method: "get",
  tags: ["Dashboard"],
  summary: "Recently created users",
  description: "Counts and paginated list of users created recently",
  response: usersRecentResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (request, reply) => {
    const raw = request.query as Record<string, unknown>;
    const period = (raw?.period as string) === "7d" ? 7 : 30;
    const limit = Math.min(100, Math.max(1, Number(raw?.limit) || 20));
    const offset = Math.max(0, Number(raw?.offset) || 0);

    const [counts, { users, total }] = await Promise.all([
      getUsersRecentCounts(),
      getUsersRecentList({ periodDays: period, limit, offset }),
    ]);

    return reply.status(200).send({
      status: 200,
      data: { counts, users, total },
    });
  },
});
