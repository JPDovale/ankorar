import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/status", () => {
  describe("Anonymous user", () => {
    test("returns valid response", async () => {
      const response = await fetch("http://localhost:9090/v1/status");
      expect(response.status).toBe(200);

      const body = (await response.json()) as any;
      const parsedUpdatedAt = new Date(body.data.updated_at).toISOString();

      expect(body).toEqual({
        data: {
          updated_at: parsedUpdatedAt,
          dependencies: {
            database: {
              version: "18.0",
              max_connections: 100,
              opened_connections: 9,
            },
          },
        },
        status: 200,
      });
    });
  });
});
