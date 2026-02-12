import { Module } from "@/src/infra/shared/entities/Module";
import { CreateUserProps, User } from "./User";
import { cryptoModule } from "../crypto/CryptoModule";
import { UserAlreadyExists } from "@/src/infra/errors/UserAlreadyExists";
import { db } from "@/src/infra/database/pool";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { authModule } from "../auth/AuthModule";
import { organizationModule } from "../organization/OrganizationModule";
import { Organization } from "../organization/Organization";
import { Member } from "../organization/Member";
import { safeCall } from "@/src/utils/safeCall";

interface UserModuleProps {
  name: string;
  Users: {
    create: (props: CreateUserProps) => Promise<{ user: User }>;
    update: (props: {
      id: string;
      name?: string;
      email?: string;
      password?: string | null;
    }) => Promise<{ user: User }>;
    delete: (props: { user: User }) => Promise<{ user: User }>;
    activateById: (props: {
      id: string;
    }) => Promise<{ user: User; organization: Organization; member: Member }>;
    hashPassword: (props: { user: User }) => Promise<{ user: User }>;
    validateUniqueEmail: (props: { user: User }) => Promise<{ user: User }>;

    fns: {
      findByEmail: (props: { email: string }) => Promise<{ user: User }>;
      findById: (props: { id: string }) => Promise<{ user: User }>;
      findByExtId: (props: { id: string }) => Promise<{ user: User }>;
      persist: (props: { user: User }) => Promise<{ user: User }>;
    };
  };
}

class UserModule extends Module<UserModuleProps> {
  static create(props: UserModuleProps) {
    return new UserModule(props, props.name);
  }

  get Users() {
    return this.props.Users;
  }
}

export const userModule = UserModule.create({
  name: "user",
  Users: {
    async create(props) {
      const user = User.create(props);
      await this.validateUniqueEmail({ user });
      await this.hashPassword({ user });
      await this.fns.persist({ user });

      return { user };
    },

    async update({ name, email, password, id }) {
      const { user } = await this.fns.findById({
        id,
      });

      user.name = name;
      user.password = password;
      user.email = email;

      await this.validateUniqueEmail({ user });
      await this.hashPassword({ user });
      await this.fns.persist({ user });

      return { user };
    },

    async activateById({ id }) {
      const { Organizations, Members } = organizationModule;

      const { user } = await this.fns.findById({ id });
      const { organization, member } = await Organizations.createForUser({
        user,
      });

      if (
        !authModule.Auth.can({
          user,
          organization,
          member,
          feature: "read:activation_token",
        })
      ) {
        throw new PermissionDenied();
      }

      member.features = ["create:session", "read:session", "create:api_key"];
      await Members.fns.persist({ member });

      return { user, organization, member };
    },

    async delete({ user }) {
      user.markAsDeleted();
      await this.fns.persist({ user });
      return { user };
    },

    async hashPassword({ user }) {
      const { Crypto } = cryptoModule;

      if (user.password) {
        const passwordHashed = await Crypto.fns.hashPassword({
          password: user.password,
        });

        user.password = passwordHashed;
      }

      return { user };
    },

    async validateUniqueEmail({ user }) {
      const userExistsResult = await safeCall(() =>
        this.fns.findByEmail({
          email: user.email,
        }),
      );

      if (
        !userExistsResult.success &&
        !(userExistsResult.error instanceof UserNotFound)
      ) {
        throw userExistsResult.error;
      }

      if (
        userExistsResult.success &&
        userExistsResult.data.user.id !== user.id
      ) {
        throw new UserAlreadyExists();
      }

      return { user };
    },

    fns: {
      async findByEmail({ email }) {
        const normalizedEmail = email.toLowerCase().trim();

        const userOnDb = await db.user.findFirst({
          where: {
            email: normalizedEmail,
            deleted_at: null,
          },
        });

        if (!userOnDb) {
          throw new UserNotFound();
        }

        const user = User.create(
          {
            email: userOnDb.email,
            name: userOnDb.name,
            password: userOnDb.password,
            deleted_at: userOnDb.deleted_at,
            ext_id: userOnDb.ext_id,
            created_at: userOnDb.created_at,
            updated_at: userOnDb.updated_at,
          },
          userOnDb.id,
        );

        return { user };
      },

      async findById({ id }) {
        const userOnDb = await db.user.findFirst({
          where: {
            id,
            deleted_at: null,
          },
        });

        if (!userOnDb) {
          throw new UserNotFound();
        }

        const user = User.create(
          {
            email: userOnDb.email,
            name: userOnDb.name,
            password: userOnDb.password,
            deleted_at: userOnDb.deleted_at,
            ext_id: userOnDb.ext_id,
            created_at: userOnDb.created_at,
            updated_at: userOnDb.updated_at,
          },
          userOnDb.id,
        );
        return { user };
      },

      async findByExtId({ id }) {
        const userOnDb = await db.user.findFirst({
          where: {
            ext_id: id,
            deleted_at: null,
          },
        });

        if (!userOnDb) {
          throw new UserNotFound();
        }

        const user = User.create(
          {
            email: userOnDb.email,
            name: userOnDb.name,
            deleted_at: userOnDb.deleted_at,
            ext_id: userOnDb.ext_id,
            password: userOnDb.password,
            created_at: userOnDb.created_at,
            updated_at: userOnDb.updated_at,
          },
          userOnDb.id,
        );

        return { user };
      },

      async persist({ user }) {
        const data = {
          created_at: user.created_at,
          email: user.email,
          id: user.id,
          name: user.name,
          ext_id: user.ext_id,
          password: user.password,
          deleted_at: user.deleted_at,
          updated_at: user.updated_at,
        };

        if (user.isNewEntity) {
          await db.user.create({
            data,
          });
        }

        if (user.isUpdatedRecently) {
          await db.user.update({
            where: {
              id: user.id,
            },
            data,
          });
        }

        return { user };
      },
    },
  },
});
