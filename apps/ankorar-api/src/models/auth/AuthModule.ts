import { Module } from "@/src/infra/shared/entities/Module";
import { User } from "../user/User";
import { userModule } from "../user/UserModule";
import { InvalidCredentials } from "@/src/infra/errors/InvalidCredentials";
import { cryptoModule } from "../crypto/CryptoModule";
import { InternalServerError } from "@/src/infra/errors/InternalServerError";
import {
  JwtPayload,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from "jsonwebtoken";
import { SessionExpired } from "@/src/infra/errors/SessionExpired";
import { date } from "../date";
import { Organization } from "../organization/Organization";
import { Member } from "../organization/Member";
import { organizationModule } from "../organization/OrganizationModule";
import { PasswordNotDefined } from "@/src/infra/errors/PasswordNotDefined";
import { safeCall } from "@/src/utils/safeCall";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

export type CreateTokenProps = {
  email: string;
  userId: string;
};

export type SignTokenProps = CreateTokenProps & { type: "access" | "refresh" };

interface AuthModuleProps {
  name: string;
  Auth: {
    getAuthenticatedUser: (props: {
      email: string;
      password: string;
    }) => Promise<{ user: User; organization: Organization; member: Member }>;
    can: (props: {
      user: User;
      organization: Organization;
      member: Member;
      feature: string;
    }) => boolean;
    createAccessToken: (props: CreateTokenProps) => {
      token: string;
      expiresIn: number;
      type: "access" | "refresh";
    };
    createRefreshToken: (props: CreateTokenProps) => {
      token: string;
      expiresIn: number;
      type: "access" | "refresh";
    };

    fns: {
      signToken: (props: SignTokenProps) => {
        token: string;
        expiresIn: number;
        type: "access" | "refresh";
      };
      getExpiresInSeconds: (props: { type: "access" | "refresh" }) => {
        expiresInSeconds: number;
      };
      normalizeKey: (props: { key?: string }) => { key: string };
      verifyToken: (props: {
        token: string;
        type: "access" | "refresh";
      }) => AuthTokenPayload;

      jwtAlgorithm: "RS256";
      defaultExpiresInSeconds: number;
      defaultRefreshExpiresInSeconds: number;
      availableFeatures: string[];
    };
  };
}

class AuthModule extends Module<AuthModuleProps> {
  static create(props: AuthModuleProps) {
    return new AuthModule(props, props.name);
  }

  get Auth() {
    return this.props.Auth;
  }
}

export const authModule = AuthModule.create({
  name: "AuthModule",
  Auth: {
    async getAuthenticatedUser({ email, password }) {
      const { Users } = userModule;
      const { Crypto } = cryptoModule;
      const { Organizations, Members } = organizationModule;

      const userResult = await safeCall(() =>
        Users.fns.findByEmail({
          email,
        }),
      );

      if (!userResult.success) {
        if (userResult.error instanceof UserNotFound) {
          throw new InvalidCredentials();
        }

        throw userResult.error;
      }

      const { user } = userResult.data;

      if (!user.password) {
        throw new PasswordNotDefined();
      }

      const passwordMatches = await Crypto.fns.comparePassword({
        password,
        hash: user.password,
      });

      if (!passwordMatches) {
        throw new InvalidCredentials();
      }

      const { organization } = await Organizations.fns.findByCreatorId({
        id: user.id,
      });

      const { member } = await Members.fns.findByUserIdAndOrgId({
        orgId: organization.id,
        userId: user.id,
      });

      return {
        user,
        organization: organization,
        member,
      };
    },

    can({ feature, user, organization, member }) {
      let authorized = false;

      if (!this.fns.availableFeatures.includes(feature)) {
        throw new InternalServerError({
          cause: "Invalid feature: " + feature,
        });
      }

      if (
        member.user_id === user.id &&
        member.org_id === organization.id &&
        member.features.includes(feature)
      ) {
        authorized = true;
      }

      return authorized;
    },

    createAccessToken({ email, userId }) {
      return this.fns.signToken({
        email,
        userId,
        type: "access",
      });
    },

    createRefreshToken({ email, userId }) {
      return this.fns.signToken({
        email,
        userId,
        type: "refresh",
      });
    },

    fns: {
      signToken({ email, type, userId }) {
        const { key: privateKey } = this.normalizeKey({
          key: process.env.JWT_PRIVATE_KEY,
        });

        const { expiresInSeconds: expiresIn } = this.getExpiresInSeconds({
          type,
        });

        const options: SignOptions = {
          algorithm: this.jwtAlgorithm,
          expiresIn,
          subject: userId,
        };

        if (process.env.JWT_ISSUER) {
          options.issuer = process.env.JWT_ISSUER;
        }

        if (process.env.JWT_AUDIENCE) {
          options.audience = process.env.JWT_AUDIENCE;
        }

        const token = sign({ email: email, type }, privateKey, options);

        return {
          token,
          expiresIn,
          type,
        };
      },

      getExpiresInSeconds({ type }) {
        const expiresInSeconds =
          type === "access"
            ? process.env.JWT_EXPIRES_IN_SECONDS
            : process.env.JWT_REFRESH_EXPIRES_IN_SECONDS;

        const defaultExpiresInSeconds =
          type === "access"
            ? this.defaultExpiresInSeconds
            : this.defaultRefreshExpiresInSeconds;

        if (!expiresInSeconds) {
          return { expiresInSeconds: defaultExpiresInSeconds };
        }

        const parsed = Number.parseInt(expiresInSeconds, 10);
        return Number.isFinite(parsed) && parsed > 0
          ? { expiresInSeconds: parsed }
          : { expiresInSeconds: defaultExpiresInSeconds };
      },

      normalizeKey({ key }) {
        if (!key) {
          throw new InternalServerError({
            cause: "JWT_KEY_IS_NOT_DEFINED is not configured",
          });
        }

        const decoded = Buffer.from(key, "base64").toString("utf-8");
        return {
          key: decoded.replace(/\\n/g, "\n"),
        };
      },

      verifyToken({ token, type }) {
        const { key: publicKey } = this.normalizeKey({
          key: process.env.JWT_PUBLIC_KEY,
        });

        const options: VerifyOptions = { algorithms: [this.jwtAlgorithm] };

        if (process.env.JWT_ISSUER) {
          options.issuer = process.env.JWT_ISSUER;
        }

        if (process.env.JWT_AUDIENCE) {
          options.audience = process.env.JWT_AUDIENCE;
        }

        try {
          const decoded = verify(token, publicKey, options);
          if (typeof decoded === "string") {
            throw new SessionExpired();
          }

          const payload = decoded as JwtPayload & {
            email?: string;
            type?: string;
          };

          if (!payload.sub || typeof payload.sub !== "string") {
            throw new SessionExpired();
          }

          if (!payload.email || typeof payload.email !== "string") {
            throw new SessionExpired();
          }

          if (payload.type !== type) {
            throw new SessionExpired();
          }

          if (
            typeof payload.iat !== "number" ||
            typeof payload.exp !== "number"
          ) {
            throw new SessionExpired();
          }

          if (
            !date.isValidUnixSeconds(payload.iat) ||
            !date.isValidUnixSeconds(payload.exp)
          ) {
            throw new SessionExpired();
          }

          if (date.isAfterNowUnix(payload.iat)) {
            throw new SessionExpired();
          }

          if (!date.isAfterNowUnix(payload.exp)) {
            throw new SessionExpired();
          }

          return {
            sub: payload.sub,
            email: payload.email,
            type,
            iat: payload.iat,
            exp: payload.exp,
            iss: typeof payload.iss === "string" ? payload.iss : undefined,
            aud: typeof payload.aud === "string" ? payload.aud : undefined,
          };
        } catch {
          throw new SessionExpired();
        }
      },

      jwtAlgorithm: "RS256",
      defaultExpiresInSeconds: 60 * 60,
      defaultRefreshExpiresInSeconds: 60 * 60 * 24 * 7,
      availableFeatures: [
        // USERS
        "create:user",
        "create:user:other",
        "read:user",

        // ACTIVATION
        "read:activation_token",

        // SESSIONS
        "create:session",
        "read:session",

        // ORGANIZATIONS
        "create:api_key",
      ],
    },
  },
});
