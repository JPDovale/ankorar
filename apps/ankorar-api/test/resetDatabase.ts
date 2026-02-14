import { reconnectDb } from "@/src/infra/database/pool";
import { execSync } from "node:child_process";
import { Client } from "pg";

const DEFAULT_E2E_SCHEMA = "ankorar_e2e";
const LEGACY_E2E_SCHEMA_REGEX =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";
let cachedOriginalDatabaseUrl: string | null = null;

function getOriginalDatabaseUrl(): string {
  if (cachedOriginalDatabaseUrl) {
    return cachedOriginalDatabaseUrl;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run e2e tests.");
  }

  cachedOriginalDatabaseUrl = databaseUrl;

  return cachedOriginalDatabaseUrl;
}

function generateSchemaUrl(originalDatabaseUrl: string, schemaId: string): string {
  const url = new URL(originalDatabaseUrl);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function dropSchema(client: Client, schemaId: string): Promise<void> {
  await client.query(`DROP SCHEMA IF EXISTS ${quoteIdentifier(schemaId)} CASCADE`);
}

async function dropLegacyE2eSchemas(client: Client): Promise<void> {
  const result = await client.query<{ schema_name: string }>(
    `
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name ~ $1
    `,
    [LEGACY_E2E_SCHEMA_REGEX],
  );

  for (const row of result.rows) {
    await dropSchema(client, row.schema_name);
  }
}

function getE2eSchemaId() {
  const customSchemaId = process.env.E2E_DATABASE_SCHEMA?.trim();

  if (customSchemaId) {
    return customSchemaId;
  }

  return DEFAULT_E2E_SCHEMA;
}

async function cleanupSchemas({
  originalDatabaseUrl,
  schemaId,
}: {
  originalDatabaseUrl: string;
  schemaId: string;
}): Promise<void> {
  const client = new Client({ connectionString: originalDatabaseUrl });

  try {
    await client.connect();
    await dropLegacyE2eSchemas(client);
    await dropSchema(client, schemaId);
  } finally {
    await client.end();
  }
}

export async function cleanupDatabaseAfterSuite() {
  const originalDatabaseUrl = getOriginalDatabaseUrl();
  const schemaId = getE2eSchemaId();

  await reconnectDb();
  await cleanupSchemas({
    originalDatabaseUrl,
    schemaId,
  });
}

export async function resetDatabase() {
  const originalDatabaseUrl = getOriginalDatabaseUrl();
  const schemaId = getE2eSchemaId();

  await reconnectDb();
  await cleanupSchemas({
    originalDatabaseUrl,
    schemaId,
  });

  process.env.DATABASE_URL = generateSchemaUrl(originalDatabaseUrl, schemaId);

  try {
    runMigrationsSilently();
  } finally {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }

  await reconnectDb(schemaId);
}

function runMigrationsSilently() {
  try {
    execSync("pnpm prisma migrate deploy", {
      stdio: "pipe",
      env: {
        ...process.env,
        NO_COLOR: "1",
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error) {
      const stdout = String((error as { stdout?: Buffer }).stdout ?? "");
      if (stdout.trim()) {
        console.error(stdout);
      }
    }

    if (error && typeof error === "object" && "stderr" in error) {
      const stderr = String((error as { stderr?: Buffer }).stderr ?? "");
      if (stderr.trim()) {
        console.error(stderr);
      }
    }

    throw error;
  }
}
