import { reconnectDb } from "@/src/infra/database/pool";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { Client } from "pg";

const originalDatabaseUrl = process.env.DATABASE_URL!;
let currentSchemaId: string | null = null;

function generateSchemaUrl(schemaId: string): string {
  const url = new URL(originalDatabaseUrl);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

async function dropSchema(schemaId: string): Promise<void> {
  const client = new Client({ connectionString: originalDatabaseUrl });
  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await client.end();
}

export async function resetDatabase() {
  if (currentSchemaId) {
    await dropSchema(currentSchemaId);
  }

  currentSchemaId = randomUUID();

  // prisma migrate deploy understands ?schema= and creates the schema + tables
  process.env.DATABASE_URL = generateSchemaUrl(currentSchemaId);
  runMigrationsSilently();

  // restore original URL and reconnect with search_path pointing to the new schema
  process.env.DATABASE_URL = originalDatabaseUrl;
  await reconnectDb(currentSchemaId);
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
