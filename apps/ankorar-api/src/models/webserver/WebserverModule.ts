import { Module } from "@/src/infra/shared/entities/Module";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { User } from "../user/User";
import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { authModule } from "../auth/AuthModule";
import { userModule } from "../user/UserModule";
import { parse as parseCookie, serialize } from "cookie";
import { Organization } from "../organization/Organization";
import { Member } from "../organization/Member";
import { organizationModule } from "../organization/OrganizationModule";
import { cryptoModule } from "../crypto/CryptoModule";
import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";

interface WebserverModuleProps {
  name: string;
  Webserver: {
    origin: string;
    fns: {
      getOrigin: () => string;
    };
  };
  Controller: {
    injectAnonymousOrUser: (props: {
      request: FastifyRequest;
    }) => Promise<void>;
    canRequest: (
      feature: string,
    ) => (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => void;
    setSessionCookies: (props: {
      accessToken: string;
      refreshToken: string;
      orgId: string;
      memberId: string;
      reply: FastifyReply;
    }) => void;

    fns: {
      injectAnonymousUser: (props: { request: FastifyRequest }) => void;
      injectAuthenticatedUser: (props: {
        request: FastifyRequest;
      }) => Promise<void>;
      injectAuthenticatedWithApiKey: (props: {
        request: FastifyRequest;
      }) => Promise<void>;
    };
  };
}

class WebserverModule extends Module<WebserverModuleProps> {
  static create(props: WebserverModuleProps) {
    return new WebserverModule(props, props.name);
  }

  get Webserver() {
    return this.props.Webserver;
  }

  get Controller() {
    return this.props.Controller;
  }

  static getOrigin() {
    const origin = `https://ankorar.com`;

    if (["development", "test"].includes(process.env.NODE_ENV ?? "")) {
      return `http://localhost:${process.env.PORT ?? 9090}`;
    }

    return origin;
  }
}

export const webserverModule = WebserverModule.create({
  name: "WebserverModule",
  Webserver: {
    origin: WebserverModule.getOrigin(),
    fns: {
      getOrigin: WebserverModule.getOrigin,
    },
  },
  Controller: {
    canRequest(feature) {
      return function (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction,
      ) {
        const { Auth } = authModule;
        const user = request.context.user;
        const member = request.context.member;
        const organization = request.context.organization;

        if (
          Auth.can({
            user,
            member,
            organization,
            feature,
          })
        ) {
          return done();
        }

        throw new PermissionDenied();
      };
    },

    async injectAnonymousOrUser({ request }) {
      if (request.headers["x-api-key"]) {
        await this.fns.injectAuthenticatedWithApiKey({ request });
        return;
      }

      if (
        request.headers.cookie &&
        request.headers.cookie.includes("access_token")
      ) {
        await this.fns.injectAuthenticatedUser({ request });
        return;
      }

      if (
        !request.headers.cookie ||
        !request.headers.cookie.includes("access_token")
      ) {
        this.fns.injectAnonymousUser({ request });
      }
    },

    setSessionCookies({ accessToken, refreshToken, orgId, memberId, reply }) {
      const setCookieRefresh = serialize("refresh_token", refreshToken, {
        path: "/",
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0"),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      const setCookieAccess = serialize("access_token", accessToken, {
        path: "/",
        maxAge: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || "0"),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      const setCookieOrg = serialize("org_id", orgId, {
        path: "/",
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0"),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      const setCookieMember = serialize("member_id", memberId, {
        path: "/",
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0"),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      reply.header("Set-Cookie", [
        setCookieRefresh,
        setCookieAccess,
        setCookieOrg,
        setCookieMember,
      ]);
    },

    fns: {
      injectAnonymousUser({ request }) {
        const user = User.create({
          email: "",
          name: "",
          password: "",
        });

        const organization = Organization.create({
          creator_id: user.id,
          name: "",
        });

        const member = Member.create({
          features: ["create:session", "create:user", "read:activation_token"],
          org_id: organization.id,
          user_id: user.id,
        });

        request.context = {
          ...request.context,
          user,
          member,
          organization,
        };
      },

      async injectAuthenticatedUser({ request }) {
        const { Auth } = authModule;
        const { Crypto } = cryptoModule;
        const { Users } = userModule;
        const { Organizations, Members } = organizationModule;

        if (!request.headers.cookie) {
          throw new PermissionDenied();
        }

        const parsedCookies = parseCookie(request.headers.cookie);

        if (
          !parsedCookies.refresh_token ||
          !parsedCookies.access_token ||
          !parsedCookies.org_id ||
          !parsedCookies.member_id
        ) {
          throw new PermissionDenied();
        }

        const payload = Auth.fns.verifyToken({
          token: parsedCookies.access_token,
          type: "access",
        });

        const orgId = parsedCookies.org_id;
        const memberId = parsedCookies.member_id;

        Crypto.fns.verifyUUIDIsValid(orgId);
        Crypto.fns.verifyUUIDIsValid(memberId);

        if (!payload) {
          throw new PermissionDenied();
        }

        if (payload) {
          const { user } = await Users.fns.findById({
            id: payload.sub,
          });

          const { organization } = await Organizations.fns.findById({
            id: orgId,
          });

          const { member } = await Members.fns.findById({
            id: memberId,
          });

          request.context = {
            ...request.context,
            user,
            member,
            organization,
            refresh_token: parsedCookies.refresh_token,
            access_token: parsedCookies.access_token,
          };
        }
      },

      async injectAuthenticatedWithApiKey({ request }) {
        const { ApiKeys } = cryptoModule;
        const { Organizations } = organizationModule;

        if (!request.headers["x-api-key"]) {
          throw new PermissionDenied();
        }

        const api_key_text = request.headers["x-api-key"];

        if (typeof api_key_text !== "string") {
          throw new InvalidApiKey();
        }

        const { apiKey } = await ApiKeys.validate({ text: api_key_text });

        const user = User.create({
          email: "",
          name: "",
          password: "",
        });

        const { organization } = await Organizations.fns.findById({
          id: apiKey.organization_id,
        });

        const member = Member.create({
          features: apiKey.features,
          org_id: apiKey.organization_id,
          user_id: user.id,
        });

        request.context = {
          ...request.context,
          user,
          member,
          organization,
        };
      },
    },
  },
});
