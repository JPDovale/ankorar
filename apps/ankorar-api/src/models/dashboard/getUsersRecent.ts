import { db } from "@/src/infra/database/pool";

export type UsersRecentCounts = {
  today: number;
  last_7d: number;
  last_30d: number;
};

export type UserRecentItem = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  subscription_status: string | null;
  stripe_price_id: string | null;
};

export async function getUsersRecentCounts(): Promise<UsersRecentCounts> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [today, last_7d, last_30d] = await Promise.all([
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
  ]);

  return { today, last_7d, last_30d };
}

type GetUsersRecentListInput = {
  periodDays: number;
  limit: number;
  offset: number;
};

export async function getUsersRecentList({
  periodDays,
  limit,
  offset,
}: GetUsersRecentListInput): Promise<{ users: UserRecentItem[]; total: number }> {
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

  const [users, total] = await Promise.all([
    db.user.findMany({
      where: {
        deleted_at: null,
        created_at: { gte: since },
      },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        subscription_status: true,
        stripe_price_id: true,
      },
    }),
    db.user.count({
      where: {
        deleted_at: null,
        created_at: { gte: since },
      },
    }),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      created_at: u.created_at,
      subscription_status: u.subscription_status,
      stripe_price_id: u.stripe_price_id,
    })),
    total,
  };
}
