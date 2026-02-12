import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { userModule } from "@/src/models/user/UserModule";
import { orchestrator } from "@/test/orchestrator";

const { Crypto: crypto } = cryptoModule;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/users", () => {
  describe("Anonymous user", () => {
    describe("With valid fields", () => {
      test("with non existent email", async () => {
        const response = await fetch("http://localhost:9090/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "jonas@gmail.com",
            password: "12345678",
            name: " Jonas ",
          }),
        });

        const body = (await response.json()) as any;

        expect(body).toEqual({
          data: null,
          status: 201,
        });

        const { user: userInDb } = await userModule.Users.fns.findByEmail({
          email: "jonas@gmail.com",
        });

        const correctPassword = await crypto.fns.comparePassword({
          password: "12345678",
          hash: userInDb!.password!,
        });

        expect(correctPassword).toBe(true);

        const incorrectPassword = await crypto.fns.comparePassword({
          password: "123456789",
          hash: userInDb!.password!,
        });

        expect(incorrectPassword).toBe(false);
        expect(userInDb?.toJson()).toEqual({
          id: expect.any(String),
          name: "Jonas",
          email: "jonas@gmail.com",
          ext_id: null,
          password: expect.any(String),
          created_at: expect.any(Date),
          updated_at: null,
          deleted_at: null,
        });
      });

      test("with existent email", async () => {
        const response = await fetch("http://localhost:9090/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "Jonas@gmail.com",
            password: "12345678",
            name: "Jonas",
          }),
        });

        const body = (await response.json()) as any;

        expect(body).toEqual({
          error: {
            action: "Tente novamente com outro e-mail.",
            message: "Usuário já existe.",
            name: "UserAlreadyExists",
            status_code: 409,
          },
          status: 409,
        });
      });
    });
  });
});
