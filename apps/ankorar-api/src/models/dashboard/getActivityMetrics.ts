import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";

export type ActivityDay = {
  date: string;
  users_created: number;
  maps_created: number;
  organizations_created: number;
};

export type ActivityMetrics = {
  period_days: number;
  by_day: ActivityDay[];
  total_users_created: number;
  total_maps_created: number;
  total_organizations_created: number;
};

export async function getActivityMetrics(periodDays: number): Promise<ActivityMetrics> {
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

  const [usersByDay, mapsByDay, orgsByDay, totalUsers, totalMaps, totalOrgs] = await Promise.all([
    db.$queryRaw<
      Array<{ day: Date; count: number }>
    >(Prisma.sql`
      SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*)::int AS count
      FROM users WHERE deleted_at IS NULL AND created_at >= ${since}
      GROUP BY 1 ORDER BY 1
    `),
    db.$queryRaw<
      Array<{ day: Date; count: number }>
    >(Prisma.sql`
      SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*)::int AS count
      FROM maps WHERE deleted_at IS NULL AND created_at >= ${since}
      GROUP BY 1 ORDER BY 1
    `),
    db.$queryRaw<
      Array<{ day: Date; count: number }>
    >(Prisma.sql`
      SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*)::int AS count
      FROM organizations WHERE deleted_at IS NULL AND created_at >= ${since}
      GROUP BY 1 ORDER BY 1
    `),
    db.user.count({
      where: { deleted_at: null, created_at: { gte: since } },
    }),
    db.map.count({
      where: { deleted_at: null, created_at: { gte: since } },
    }),
    db.organization.count({
      where: { deleted_at: null, created_at: { gte: since } },
    }),
  ]);

  const dayMap = new Map<string, ActivityDay>();
  for (let d = 0; d < periodDays; d++) {
    const date = new Date(since);
    date.setDate(date.getDate() + d);
    const key = date.toISOString().slice(0, 10);
    dayMap.set(key, {
      date: key,
      users_created: 0,
      maps_created: 0,
      organizations_created: 0,
    });
  }
  for (const row of usersByDay) {
    const key = new Date(row.day).toISOString().slice(0, 10);
    const entry = dayMap.get(key);
    if (entry) entry.users_created = row.count;
  }
  for (const row of mapsByDay) {
    const key = new Date(row.day).toISOString().slice(0, 10);
    const entry = dayMap.get(key);
    if (entry) entry.maps_created = row.count;
  }
  for (const row of orgsByDay) {
    const key = new Date(row.day).toISOString().slice(0, 10);
    const entry = dayMap.get(key);
    if (entry) entry.organizations_created = row.count;
  }

  const by_day = Array.from(dayMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return {
    period_days: periodDays,
    by_day,
    total_users_created: totalUsers,
    total_maps_created: totalMaps,
    total_organizations_created: totalOrgs,
  };
}
