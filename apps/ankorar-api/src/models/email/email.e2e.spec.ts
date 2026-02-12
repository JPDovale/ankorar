import { orchestrator } from "@/test/orchestrator";
import { email } from ".";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("Email E2E Tests", () => {
  it("should send an email", async () => {
    await email.send({
      to: "<test@example.com>",
      subject: "Test Email",
      text: "This is a test email.",
      from: "<jonas@gmail.com>",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail).toEqual({
      id: expect.any(Number),
      sender: "<jonas@gmail.com>",
      recipients: ["<test@example.com>"],
      subject: "Test Email",
      body: "This is a test email.\n",
      size: expect.any(String),
      created_at: expect.any(String),
    });
  });
});
