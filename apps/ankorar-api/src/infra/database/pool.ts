import { PrismaClient } from "./prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let _client: PrismaClient;
let _searchPath: string | null = null;

function createClient(): PrismaClient {
  const connectionString = `${process.env.DATABASE_URL}`;

  const poolConfig: pg.PoolConfig = { connectionString };

  if (_searchPath) {
    poolConfig.options = `-c search_path="${_searchPath}"`;
  }

  const pool = new pg.Pool(poolConfig);
  const adapter = new PrismaPg(pool, {
    schema: _searchPath ?? undefined,
    disposeExternalPool: true,
  });
  return new PrismaClient({ adapter });
}

_client = createClient();

export async function reconnectDb(searchPath?: string) {
  await _client.$disconnect();
  _searchPath = searchPath ?? null;
  _client = createClient();
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (_client as any)[prop];
  },
}) as unknown as PrismaClient;
