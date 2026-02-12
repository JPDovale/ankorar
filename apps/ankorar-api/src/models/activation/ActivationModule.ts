import { Module } from "@/src/infra/shared/entities/Module";
import { ActivationToken, CreateActivationTokenProps } from "./ActivationToken";
import { User } from "../user/User";
import { date } from "../date";
import { db } from "@/src/infra/database/pool";
import { email } from "../email";
import { ActivationTokenNotFound } from "@/src/infra/errors/ActivationTokenNotFound";
import { webserverModule } from "../webserver/WebserverModule";

interface ActivationModuleProps {
  name: string;
  ActivationTokens: {
    create: (
      props: CreateActivationTokenProps,
    ) => Promise<{ activationToken: ActivationToken }>;
    createForUser: (props: {
      user: User;
    }) => Promise<{ activationToken: ActivationToken }>;
    markTokenAsUsed: (props: {
      activationToken: ActivationToken;
    }) => Promise<{ activationToken: ActivationToken }>;
    fns: {
      persist: (props: {
        activationToken: ActivationToken;
      }) => Promise<{ activationToken: ActivationToken }>;
      sendEmailOfActivationToUser: (props: {
        user: User;
        activationToken: ActivationToken;
      }) => Promise<void>;
      findValidById: (props: {
        id: string;
      }) => Promise<{ activationToken: ActivationToken }>;
    };
  };
}

class ActivationModule extends Module<ActivationModuleProps> {
  static create(props: ActivationModuleProps) {
    return new ActivationModule(props, props.name);
  }

  get ActivationTokens() {
    return this.props.ActivationTokens;
  }
}

export const activationModule = ActivationModule.create({
  name: "activationModule",
  ActivationTokens: {
    async create(props) {
      const activationToken = ActivationToken.create(props);
      await this.fns.persist({ activationToken });
      return { activationToken };
    },

    async createForUser({ user }) {
      const expiresAt = date.addMinutes(date.nowUtcDate(), 15);

      const { activationToken } = await this.create({
        expires_at: expiresAt,
        user_id: user.id,
      });

      return { activationToken };
    },

    async markTokenAsUsed({ activationToken }) {
      activationToken.used_at = date.nowUtcDate();
      await this.fns.persist({ activationToken });

      return { activationToken };
    },

    fns: {
      async persist({ activationToken }) {
        const data = {
          created_at: activationToken.created_at,
          expires_at: activationToken.expires_at,
          id: activationToken.id,
          updated_at: activationToken.updated_at,
          used_at: activationToken.used_at,
          user_id: activationToken.user_id,
        };

        if (activationToken.isNewEntity) {
          await db.activationToken.create({ data });
        }

        if (activationToken.isUpdatedRecently) {
          await db.activationToken.update({
            where: { id: activationToken.id },
            data,
          });
        }

        return { activationToken };
      },

      async sendEmailOfActivationToUser({ activationToken, user }) {
        const { Webserver: webserver } = webserverModule;

        await email.send({
          from: "Ankorar <contato@ankorar.com>",
          to: user.email,
          subject: "Ative sua conta no Ankorar",
          text: `${user.name},\n\nPor favor, clique no link abaixo para ativar sua conta:\n\n${webserver.origin}/register/activate/${activationToken.id}\n\nObrigado,\nEquipe Ankorar`,
        });
      },

      async findValidById({ id }) {
        const activationTokenOnDb = await db.activationToken.findUnique({
          where: {
            id,
            used_at: null,
            expires_at: {
              gt: date.nowUtcDate(),
            },
          },
        });

        if (!activationTokenOnDb) {
          throw new ActivationTokenNotFound();
        }

        const activationToken = ActivationToken.create(
          {
            expires_at: activationTokenOnDb.expires_at,
            user_id: activationTokenOnDb.user_id,
            created_at: activationTokenOnDb.created_at,
            updated_at: activationTokenOnDb.updated_at,
            used_at: activationTokenOnDb.used_at,
          },
          activationTokenOnDb.id,
        );

        return { activationToken };
      },
    },
  },
});
