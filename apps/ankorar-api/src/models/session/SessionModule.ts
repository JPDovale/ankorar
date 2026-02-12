import { Module } from "@/src/infra/shared/entities/Module";
import { CreateSessionProps, Session } from "./Session";
import { SessionExpired } from "@/src/infra/errors/SessionExpired";
import { authModule } from "../auth/AuthModule";
import { date } from "../date";
import { db } from "@/src/infra/database/pool";
import { User } from "../user/User";
import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { organizationModule } from "../organization/OrganizationModule";

interface AuthTokenResult {
  token: string;
  expiresIn: number;
  type: "access" | "refresh";
}

interface SessionModuleProps {
  name: string;
  Sessions: {
    create: (props: CreateSessionProps) => Promise<{ session: Session }>;
    createForUser: (props: { user: User }) => Promise<{
      session: Session;
      accessToken: AuthTokenResult;
      refreshToken: AuthTokenResult;
    }>;
    refresh: (props: { token: string }) => Promise<{
      session: Session;
      accessToken: AuthTokenResult;
      refreshToken: AuthTokenResult;
    }>;

    fns: {
      findValidByTokenAndUserId: (props: {
        userId: string;
        token: string;
      }) => Promise<{ session: Session }>;
      persist: (props: { session: Session }) => Promise<{ session: Session }>;
    };
  };
}

class SessionModule extends Module<SessionModuleProps> {
  static create(props: SessionModuleProps) {
    return new SessionModule(props, props.name);
  }

  get Sessions() {
    return this.props.Sessions;
  }
}

export const sessionModule = SessionModule.create({
  name: "SessionModule",
  Sessions: {
    async create(props) {
      const session = Session.create(props);
      await this.fns.persist({ session });
      return { session };
    },

    async createForUser({ user }) {
      const { Auth } = authModule;
      const { Organizations, Members } = organizationModule;

      const { organization } = await Organizations.fns.findByCreatorId({
        id: user.id,
      });
      const { member } = await Members.fns.findByUserIdAndOrgId({
        orgId: organization.id,
        userId: user.id,
      });

      if (
        !Auth.can({
          user,
          member,
          organization,
          feature: "create:session",
        })
      ) {
        throw new PermissionDenied();
      }

      const accessToken = Auth.createAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = Auth.createRefreshToken({
        userId: user.id,
        email: user.email,
      });

      const { session } = await this.create({
        user_id: user.id,
        refresh_token: refreshToken.token,
        expires_at: date.addSeconds(date.nowUtcDate(), refreshToken.expiresIn),
        created_at: date.nowUtcDate(),
      });

      return {
        accessToken,
        refreshToken,
        session,
      };
    },

    async refresh({ token }) {
      const { Auth } = authModule;

      const payload = Auth.fns.verifyToken({
        token,
        type: "refresh",
      });

      const { session: sessionValid } =
        await this.fns.findValidByTokenAndUserId({
          token,
          userId: payload.sub,
        });

      if (!sessionValid) {
        throw new SessionExpired();
      }

      const accessToken = Auth.createAccessToken({
        userId: payload.sub,
        email: payload.email,
      });

      const refreshToken = Auth.createRefreshToken({
        userId: payload.sub,
        email: payload.email,
      });

      sessionValid.refresh_token = refreshToken.token;
      sessionValid.expires_at = date.addSeconds(
        date.nowUtcDate(),
        refreshToken.expiresIn,
      );

      await this.fns.persist({ session: sessionValid });

      return {
        session: sessionValid,
        accessToken,
        refreshToken,
      };
    },

    fns: {
      async findValidByTokenAndUserId({ token, userId }) {
        const sessionOnDb = await db.session.findFirst({
          where: {
            refresh_token: token,
            user_id: userId,
            expires_at: {
              gt: date.nowUtcDate(),
            },
          },
        });

        if (!sessionOnDb) {
          throw new SessionExpired();
        }

        const session = Session.create(
          {
            expires_at: sessionOnDb.expires_at,
            refresh_token: sessionOnDb.refresh_token,
            user_id: sessionOnDb.user_id,
            created_at: sessionOnDb.created_at,
            updated_at: sessionOnDb.updated_at,
          },
          sessionOnDb.id,
        );

        return { session };
      },

      async persist({ session }) {
        function map(session: Session) {
          return {
            created_at: session.created_at,
            deleted_at: null,
            expires_at: session.expires_at,
            id: session.id,
            refresh_token: session.refresh_token,
            updated_at: session.updated_at,
            user_id: session.user_id,
          };
        }

        if (session.isUpdatedRecently) {
          await db.session.update({
            where: {
              id: session.id,
            },
            data: map(session),
          });
        }

        if (session.isNewEntity) {
          await db.session.create({
            data: map(session),
          });
        }

        return { session };
      },
    },
  },
});
