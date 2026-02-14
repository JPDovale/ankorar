import { createServerInstance } from "@/src/server";
import { afterAll, beforeAll } from "vitest";
import { cleanupDatabaseAfterSuite } from "./resetDatabase";

type TestServerInstance = ReturnType<typeof createServerInstance>;
let testServer: TestServerInstance | null = null;

beforeAll(async () => {
  if (!testServer) {
    testServer = createServerInstance({ log: "never" });
    await testServer.run();
  }
});

afterAll(async () => {
  if (testServer) {
    await testServer.close();
    testServer = null;
  }

  await cleanupDatabaseAfterSuite();
});
