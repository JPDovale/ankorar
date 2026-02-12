import { Module } from "@/src/infra/shared/entities/Module";
import { CreateOrganizationProps, Organization } from "./Organization";
import { db } from "@/src/infra/database/pool";
import { CreateMemberProps, Member } from "./Member";
import { User } from "../user/User";
import { safeCall } from "@/src/utils/safeCall";

interface MemberFns {
  findById: (props: { id: string }) => Promise<{ member: Member }>;
  findByUserIdAndOrgId: (props: {
    userId: string;
    orgId: string;
  }) => Promise<{ member: Member }>;
  persist: (props: { member: Member }) => Promise<{ member: Member }>;
}

interface MemberMod {
  create: (props: CreateMemberProps) => Promise<{ member: Member }>;
  fns: MemberFns;
}

interface OrganizationModuleProps {
  name: string;
  Organizations: {
    create: (
      props: CreateOrganizationProps,
    ) => Promise<{ organization: Organization }>;
    createForUser: (props: {
      user: User;
    }) => Promise<{ organization: Organization; member: Member }>;
    upsertMember: (props: {
      user: User;
      organization: Organization;
      features: string[];
    }) => Promise<{ member: Member }>;
    fns: {
      findById: (props: {
        id: string;
      }) => Promise<{ organization: Organization }>;
      findByUserId: (props: {
        userId: string;
      }) => Promise<{ organizations: Array<{ organization: Organization; member: Member }> }>;
      persist: (props: {
        organization: Organization;
      }) => Promise<{ organization: Organization }>;
      findByCreatorId: (props: {
        id: string;
      }) => Promise<{ organization: Organization }>;
    };
  };
  Members: MemberMod;
}

class OrganizationModule extends Module<OrganizationModuleProps> {
  static create(props: OrganizationModuleProps) {
    return new OrganizationModule(props, props.name);
  }

  get Organizations() {
    return this.props.Organizations;
  }

  get Members() {
    return this.props.Members;
  }
}

const memberFns: MemberFns = {
  async findById({ id }) {
    const memberOnDb = await db.member.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!memberOnDb) {
      throw new Error("Member not found");
    }

    const member = Member.create(
      {
        features: memberOnDb.features,
        user_id: memberOnDb.user_id,
        org_id: memberOnDb.org_id,
        created_at: memberOnDb.created_at,
        updated_at: memberOnDb.updated_at,
        deleted_at: memberOnDb.deleted_at,
      },
      memberOnDb.id,
    );

    return { member };
  },

  async findByUserIdAndOrgId({ orgId, userId }) {
    const memberOnDb = await db.member.findFirst({
      where: {
        user_id: userId,
        org_id: orgId,
        deleted_at: null,
      },
    });

    if (!memberOnDb) {
      throw new Error("Member not found");
    }

    const member = Member.create(
      {
        features: memberOnDb.features,
        user_id: memberOnDb.user_id,
        org_id: memberOnDb.org_id,
        created_at: memberOnDb.created_at,
        updated_at: memberOnDb.updated_at,
        deleted_at: memberOnDb.deleted_at,
      },
      memberOnDb.id,
    );

    return { member };
  },

  async persist({ member }) {
    function map(member: Member) {
      return {
        id: member.id,
        org_id: member.org_id,
        user_id: member.user_id,
        features: member.features,
        created_at: member.created_at,
        updated_at: member.updated_at,
        deleted_at: member.deleted_at,
      };
    }

    if (member.isNewEntity) {
      await db.member.create({
        data: map(member),
      });
    }

    if (member.isUpdatedRecently) {
      await db.member.update({
        where: {
          id: member.id,
        },
        data: map(member),
      });
    }

    member.forceNotNew();

    return { member };
  },
};

const memberMod: MemberMod = {
  async create(props) {
    const member = Member.create(props);

    await this.fns.persist({ member });

    return { member };
  },

  fns: memberFns,
};

export const organizationModule = OrganizationModule.create({
  name: "organization",
  Organizations: {
    async create(props) {
      const organization = Organization.create(props);

      await this.fns.persist({ organization });

      return { organization };
    },

    async createForUser({ user }) {
      const { organization } = await this.create({
        name: `Org ${user.name}'s`,
        creator_id: user.id,
      });

      const { member } = await memberMod.create({
        features: ["read:activation_token"],
        org_id: organization.id,
        user_id: user.id,
      });

      return { member, organization };
    },

    async upsertMember({ features, organization, user }) {
      const memberResult = await safeCall(
        () =>
          memberMod.fns.findByUserIdAndOrgId({
            orgId: organization.id,
            userId: user.id,
          }),
      );

      if (memberResult.success) {
        const { member: memberExists } = memberResult.data;
        memberExists.features = features;
        await memberMod.fns.persist({ member: memberExists });
        return { member: memberExists };
      }

      const { member } = await memberMod.create({
        features,
        org_id: organization.id,
        user_id: user.id,
      });

      return { member };
    },

    fns: {
      async findById({ id }) {
        const organizationOnDb = await db.organization.findFirst({
          where: {
            id,
            deleted_at: null,
          },
        });

        if (!organizationOnDb) {
          throw new Error("Organization not found");
        }

        const organization = Organization.create(
          {
            name: organizationOnDb.name,
            creator_id: organizationOnDb.creator_id,
            created_at: organizationOnDb.created_at,
            updated_at: organizationOnDb.updated_at,
          },
          organizationOnDb.id,
        );

        return { organization };
      },

      async findByUserId({ userId }) {
        const membersOnDb = await db.member.findMany({
          where: {
            user_id: userId,
            deleted_at: null,
          },
          include: {
            org: true,
          },
          orderBy: {
            created_at: "asc",
          },
        });

        const organizations = membersOnDb
          .filter((memberOnDb) => memberOnDb.org.deleted_at === null)
          .map((memberOnDb) => {
            const organization = Organization.create(
              {
                name: memberOnDb.org.name,
                creator_id: memberOnDb.org.creator_id,
                created_at: memberOnDb.org.created_at,
                updated_at: memberOnDb.org.updated_at,
              },
              memberOnDb.org.id,
            );

            const member = Member.create(
              {
                features: memberOnDb.features,
                user_id: memberOnDb.user_id,
                org_id: memberOnDb.org_id,
                created_at: memberOnDb.created_at,
                updated_at: memberOnDb.updated_at,
                deleted_at: memberOnDb.deleted_at,
              },
              memberOnDb.id,
            );

            return {
              organization,
              member,
            };
          });

        return { organizations };
      },

      async persist({ organization }) {
        function map(organization: Organization) {
          return {
            id: organization.id,
            name: organization.name,
            creator_id: organization.creator_id,
            created_at: organization.created_at,
            updated_at: organization.updated_at,
            deleted_at: organization.deleted_at,
          };
        }

        if (organization.isNewEntity) {
          await db.organization.create({
            data: map(organization),
          });
        }

        if (organization.isUpdatedRecently) {
          await db.organization.update({
            where: {
              id: organization.id,
            },
            data: map(organization),
          });
        }

        return { organization };
      },

      async findByCreatorId({ id }) {
        const organizationOnDb = await db.organization.findUnique({
          where: {
            creator_id: id,
          },
        });

        if (!organizationOnDb) {
          throw new Error("Organization not found");
        }

        const organization = Organization.create(
          {
            name: organizationOnDb.name,
            creator_id: organizationOnDb.creator_id,
            created_at: organizationOnDb.created_at,
            updated_at: organizationOnDb.updated_at,
          },
          organizationOnDb.id,
        );

        return { organization };
      },
    },
  },
  Members: memberMod,
});
