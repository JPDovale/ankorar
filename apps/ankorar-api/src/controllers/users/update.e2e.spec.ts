import { userModule } from "@/src/models/user/UserModule";
import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { orchestrator } from "@/test/orchestrator";
import { safeCall } from "@/src/utils/safeCall";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";

const { Crypto: crypto } = cryptoModule;
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[PATCH] /v1/users/:email", () => {
  describe("Anonymous user", () => {
    describe("With non existent email", () => {
      test("with non existent email", async () => {
        const response = await fetch(
          "http://localhost:9090/v1/users/jonas@gmail.com",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: "12345678",
            }),
          },
        );

        const body = (await response.json()) as any;

        expect(body).toEqual({
          error: {
            action: "Tente novamente com outro e-mail.",
            message: "Usuário não encontrado.",
            name: "UserNotFound",
            status_code: 404,
          },
          status: 404,
        });
      });

      test("with duplicated email", async () => {
        await orchestrator.createUser({
          email: "uniqueEmail1@gmail.com",
        });

        await orchestrator.createUser({
          email: "uniqueEmail2@gmail.com",
        });

        const response = await fetch(
          "http://localhost:9090/v1/users/uniqueEmail1@gmail.com",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "uniqueEmail2@gmail.com",
            }),
          },
        );

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

      test("with a unique email", async () => {
        const { user: newUser } = await orchestrator.createUser({
          email: "uniqueEmail3@gmail.com",
        });

        const response = await fetch(
          "http://localhost:9090/v1/users/uniqueEmail3@gmail.com",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "uniqueEmail4@gmail.com",
            }),
          },
        );

        expect(response.status).toBe(204);

        const { user: userInDb } = await userModule.Users.fns.findByEmail({
          email: "uniqueEmail4@gmail.com",
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb?.updated_at).not.toBeNull();
        expect(userInDb!.updated_at! > userInDb!.created_at!).toBe(true);
        expect(userInDb?.email).toBe("uniqueemail4@gmail.com");

        const oldUserInDbResult = await safeCall(() =>
          userModule.Users.fns.findByEmail({
            email: "uniqueEmail3@gmail.com",
          }),
        );

        expect(oldUserInDbResult.success).toBe(false);
        if (!oldUserInDbResult.success) {
          expect(oldUserInDbResult.error).toBeInstanceOf(UserNotFound);
        }
        expect(userInDb?.toJson()).toEqual({
          id: newUser.id,
          name: newUser.name,
          email: "uniqueemail4@gmail.com",
          ext_id: null,
          password: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        });
      });

      test("with a different password", async () => {
        const { user: newUser } = await orchestrator.createUser({
          password: "password123",
        });

        const response = await fetch(
          `http://localhost:9090/v1/users/${newUser.email}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: "newPassword456",
            }),
          },
        );

        expect(response.status).toBe(204);

        const { user: userInDb } = await userModule.Users.fns.findByEmail({
          email: newUser.email,
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb?.updated_at).not.toBeNull();
        expect(userInDb!.updated_at! > userInDb!.created_at).toBe(true);

        const correctPassword = await crypto.fns.comparePassword({
          password: "newPassword456",
          hash: userInDb!.password!,
        });

        expect(correctPassword).toBe(true);

        const incorrectPassword = await crypto.fns.comparePassword({
          password: "password123",
          hash: userInDb!.password!,
        });

        expect(incorrectPassword).toBe(false);
        expect(userInDb?.toJson()).toEqual({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          ext_id: null,
          password: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        });
      });

      test("with a different name", async () => {
        const { user: newUser } = await orchestrator.createUser({
          email: "uniqueEmail7@gmail.com",
        });

        const response = await fetch(
          "http://localhost:9090/v1/users/uniqueEmail7@gmail.com",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "New Name",
            }),
          },
        );

        expect(response.status).toBe(204);

        const { user: userInDb } = await userModule.Users.fns.findByEmail({
          email: "uniqueEmail7@gmail.com",
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb?.updated_at).not.toBeNull();
        expect(userInDb!.updated_at! > userInDb!.created_at).toBe(true);
        expect(userInDb?.name).toBe("New Name");
        expect(userInDb?.toJson()).toEqual({
          id: newUser.id,
          name: "New Name",
          email: "uniqueemail7@gmail.com",
          ext_id: null,
          password: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        });
      });
    });
  });
});
