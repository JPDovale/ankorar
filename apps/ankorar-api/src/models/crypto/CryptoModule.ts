import { ValidationError } from "@/src/infra/errors/ValidationError";
import { Module } from "@/src/infra/shared/entities/Module";
import { compare, hash } from "bcryptjs";
import { v7 as uuidv7 } from "uuid";
import z from "zod";
import { ApiKey, CreateApiKeyProps } from "./ApiKey";
import { db } from "@/src/infra/database/pool";
import { Organization } from "../organization/Organization";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ApiKeyNotFound } from "@/src/infra/errors/ApiKeyNotFound";
import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";
import { ApiKeyIsExpired } from "@/src/infra/errors/ApiKeyIsExpired";
import { date } from "../date";

interface CryptoModuleProps {
  name: string;
  ApiKeys: {
    create: (props: CreateApiKeyProps) => Promise<{ apiKey: ApiKey }>;
    createForOrganization: (props: {
      organization: Organization;
    }) => Promise<{ apiKey: ApiKey; text: string }>;
    validate: (props: { text: string }) => Promise<{ apiKey: ApiKey }>;

    fns: {
      persist: (props: { apiKey: ApiKey }) => Promise<{ apiKey: ApiKey }>;
      findByPrefix: (props: { prefix: string }) => Promise<{ apiKey: ApiKey }>;
      generateUniquePrefix: () => string;
      generateSecret: () => string;
      hashSecret: (props: { secret: string }) => string;
      computeText: (props: { text: string }) => {
        env: "live" | "test";
        prefix: string;
        secret: string;
        scope: string;
      };
      safeEqualText: (a: string, b: string) => void;
    };
  };

  Crypto: {
    fns: {
      createId: () => string;
      comparePassword: (props: {
        password: string;
        hash: string;
      }) => Promise<boolean>;
      hashPassword: (props: { password: string }) => Promise<string>;
      getRounds: () => number;
      verifyUUIDIsValid: (uuid: string) => void;
    };
  };
}

class CryptoModule extends Module<CryptoModuleProps> {
  static create(props: CryptoModuleProps) {
    return new CryptoModule(props, props.name);
  }

  get Crypto() {
    return this.props.Crypto;
  }

  get ApiKeys() {
    return this.props.ApiKeys;
  }
}

export const cryptoModule = CryptoModule.create({
  name: "CryptoModule",
  ApiKeys: {
    async create(props) {
      const apiKey = ApiKey.create(props);

      await this.fns.persist({ apiKey });

      return { apiKey };
    },

    async createForOrganization({ organization }) {
      const secret = this.fns.generateSecret();
      const hashedSecret = this.fns.hashSecret({ secret });
      const prefix = this.fns.generateUniquePrefix();

      const { apiKey } = await this.create({
        organization_id: organization.id,
        prefix,
        secret: hashedSecret,
        features: ["create:user:other"],
      });

      const text = apiKey.getCompleteApiKey(secret);

      return { apiKey, text };
    },

    async validate({ text }) {
      const { prefix, secret } = this.fns.computeText({ text });
      const { apiKey } = await this.fns.findByPrefix({ prefix });

      if (apiKey.revoked_at !== null) {
        throw new ApiKeyIsExpired();
      }

      if (apiKey.expires_at && apiKey.expires_at > date.nowUtcDate()) {
        throw new ApiKeyIsExpired();
      }

      const hashedSecret = this.fns.hashSecret({ secret });
      this.fns.safeEqualText(hashedSecret, apiKey.secret);

      apiKey.last_used_at = date.nowUtcDate();

      await this.fns.persist({ apiKey });

      return { apiKey };
    },

    fns: {
      async persist({ apiKey }) {
        const data = {
          created_at: apiKey.created_at,
          env: apiKey.env,
          id: apiKey.id,
          last_used_at: apiKey.last_used_at,
          secret: apiKey.secret,
          prefix: apiKey.prefix,
          deleted_at: apiKey.deleted_at,
          expires_at: apiKey.expires_at,
          features: apiKey.features,
          organization_id: apiKey.organization_id,
          revoked_at: apiKey.revoked_at,
          updated_at: apiKey.updated_at,
        };

        if (apiKey.isNewEntity) {
          await db.apiKey.create({
            data,
          });
        }

        if (apiKey.isUpdatedRecently) {
          await db.apiKey.update({
            where: { id: apiKey.id },
            data,
          });
        }

        return { apiKey };
      },

      async findByPrefix({ prefix }) {
        const apiKeyOnDb = await db.apiKey.findUnique({
          where: {
            prefix,
            deleted_at: null,
          },
        });

        if (!apiKeyOnDb) {
          throw new ApiKeyNotFound();
        }

        const apiKey = ApiKey.create(
          {
            features: apiKeyOnDb.features,
            organization_id: apiKeyOnDb.organization_id,
            prefix: apiKeyOnDb.prefix,
            secret: apiKeyOnDb.secret,
            created_at: apiKeyOnDb.created_at,
            deleted_at: apiKeyOnDb.deleted_at,
            env: apiKeyOnDb.env as "live" | "test",
            expires_at: apiKeyOnDb.expires_at,
            last_used_at: apiKeyOnDb.last_used_at,
            revoked_at: apiKeyOnDb.revoked_at,
            updated_at: apiKeyOnDb.updated_at,
          },
          apiKeyOnDb.id,
        );

        return { apiKey };
      },

      generateUniquePrefix() {
        return uuidv7().split("-").slice(0, 2).join().replaceAll(",", "");
      },

      generateSecret() {
        return randomBytes(32).toString("base64");
      },

      hashSecret({ secret }) {
        return createHmac("sha256", process.env.API_KEY_PEPPER!)
          .update(secret, "utf-8")
          .digest("base64");
      },

      computeText({ text }) {
        const [ak, scope, env, prefix, ...secretParts] = text.split("_");
        const secret = secretParts.join("_");

        if (!scope || !env || !prefix || !secret) {
          throw new InvalidApiKey();
        }

        if (
          ak !== "ak" ||
          scope !== "org" ||
          (env !== "live" && env !== "test")
        ) {
          throw new InvalidApiKey();
        }

        return {
          env,
          prefix,
          scope,
          secret,
        };
      },

      safeEqualText(a, b) {
        const ab = Buffer.from(a, "utf-8");
        const bb = Buffer.from(b, "utf-8");

        if (ab.length !== bb.length) {
          throw new InvalidApiKey();
        }

        const isValid = timingSafeEqual(ab, bb);

        if (!isValid) {
          throw new InvalidApiKey();
        }
      },
    },
  },

  Crypto: {
    fns: {
      async comparePassword({ password, hash }) {
        const passwordPepper = password + process.env.PEPPER;
        const match = await compare(passwordPepper, hash);
        return match;
      },

      async hashPassword({ password }) {
        const passwordPepper = password + process.env.PEPPER;
        const passwordHashed = await hash(passwordPepper, this.getRounds());
        return passwordHashed;
      },

      createId() {
        return uuidv7();
      },

      getRounds() {
        return process.env.NODE_ENV === "test" ? 1 : 14;
      },

      verifyUUIDIsValid(uuid) {
        const uuidValidator = z.uuidv7();

        const { success } = uuidValidator.safeParse(uuid);

        if (!success) {
          throw new ValidationError({
            message: "Verify id of entities sended",
          });
        }
      },
    },
  },
});
