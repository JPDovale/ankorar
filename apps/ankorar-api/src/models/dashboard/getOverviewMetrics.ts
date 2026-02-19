import { db } from "@/src/infra/database/pool";

const ACTIVE_STATUSES = ["active", "trialing"];

export type OverviewMetrics = {
  total_users: number;
  total_organizations: number;
  total_maps: number;
  users_created_today: number;
  users_created_last_7d: number;
  users_created_last_30d: number;
  active_subscriptions: number;
  canceled_subscriptions: number;
};

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    total_users,
    total_organizations,
    total_maps,
    users_created_today,
    users_created_last_7d,
    users_created_last_30d,
    active_subscriptions,
    canceled_subscriptions,
  ] = await Promise.all([
    db.user.count({ where: { deleted_at: null } }),
    db.organization.count({ where: { deleted_at: null } }),
    db.map.count({ where: { deleted_at: null } }),
    db.user.count({
      where: {
        deleted_at: null,
        created_at: { gte: startOfToday },
      },
    }),
    db.user.count({
      where: {
        deleted_at: null,
        created_at: { gte: sevenDaysAgo },
      },
    }),
    db.user.count({
      where: {
        deleted_at: null,
        created_at: { gte: thirtyDaysAgo },
      },
    }),
    db.user.count({
      where: {
        deleted_at: null,
        subscription_status: { in: ACTIVE_STATUSES },
        stripe_price_id: { not: null },
      },
    }),
    db.user.count({
      where: {
        deleted_at: null,
        subscription_status: "canceled",
      },
    }),
  ]);

  return {
    total_users,
    total_organizations,
    total_maps,
    users_created_today,
    users_created_last_7d,
    users_created_last_30d,
    active_subscriptions,
    canceled_subscriptions,
  };
}
