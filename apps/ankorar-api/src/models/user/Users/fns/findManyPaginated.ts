import { db } from "@/src/infra/database/pool";

export type UserListPreview = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  subscription_status: string | null;
  stripe_price_id: string | null;
};

type FindManyPaginatedInput = {
  limit: number;
  offset: number;
};

type FindManyPaginatedResponse = {
  users: UserListPreview[];
  total: number;
};

export async function findManyPaginated({
  limit,
  offset,
}: FindManyPaginatedInput): Promise<FindManyPaginatedResponse> {
  const [users, total] = await Promise.all([
    db.user.findMany({
      where: { deleted_at: null },
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
    db.user.count({ where: { deleted_at: null } }),
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
