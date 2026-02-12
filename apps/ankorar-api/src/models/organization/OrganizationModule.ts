import { db } from "@/src/infra/database/pool";
import { OrganizationInviteNotFound } from "@/src/infra/errors/OrganizationInviteNotFound";
import { ValidationError } from "@/src/infra/errors/ValidationError";
import { Module } from "@/src/infra/shared/entities/Module";
import { date } from "@/src/models/date";
import { CreateMemberProps, Member } from "./Member";
import {
  OrganizationInvite,
  OrganizationInviteStatus,
} from "./OrganizationInvite";
import { CreateOrganizationProps, Organization } from "./Organization";
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

export interface OrganizationInvitePreview {
  id: string;
  email: string;
  status: string;
  created_at: Date;
  organization: {
    id: string;
    name: string;
  };
  invited_by_user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrganizationInviteFns {
  normalizeEmail: (email: string) => string;
  findPendingByIdAndUserId: (props: {
    id: string;
    userId: string;
  }) => Promise<{ organizationInvite: OrganizationInvite }>;
  persist: (props: {
    organizationInvite: OrganizationInvite;
  }) => Promise<{ organizationInvite: OrganizationInvite }>;
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
    createInvite: (props: {
      organizationId: string;
      invitedByUserId: string;
      email: string;
    }) => Promise<{ organizationInvite: OrganizationInvite }>;
    listPendingInvitesByUserId: (props: {
      userId: string;
    }) => Promise<{ invites: OrganizationInvitePreview[] }>;
    acceptInvite: (props: {
      inviteId: string;
      user: User;
    }) => Promise<{ organizationInvite: OrganizationInvite }>;
    rejectInvite: (props: {
      inviteId: string;
      user: User;
    }) => Promise<{ organizationInvite: OrganizationInvite }>;
    fns: {
      findById: (props: {
        id: string;
      }) => Promise<{ organization: Organization }>;
      findByUserId: (props: { userId: string }) => Promise<{
        organizations: Array<{ organization: Organization; member: Member }>;
      }>;
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

function toOrganizationInviteStatus(status: string): OrganizationInviteStatus {
  if (status === "accepted" || status === "rejected") {
    return status;
  }

  return "pending";
}

const organizationInviteFns: OrganizationInviteFns = {
  normalizeEmail(email) {
    return email.trim().toLowerCase();
  },

  async findPendingByIdAndUserId({ id, userId }) {
    const inviteOnDb = await db.organizationInvite.findFirst({
      where: {
        id,
        invited_user_id: userId,
        status: "pending",
        deleted_at: null,
      },
    });

    if (!inviteOnDb) {
      throw new OrganizationInviteNotFound();
    }

    const organizationInvite = OrganizationInvite.create(
      {
        email: inviteOnDb.email,
        status: toOrganizationInviteStatus(inviteOnDb.status),
        organization_id: inviteOnDb.organization_id,
        invited_by_user_id: inviteOnDb.invited_by_user_id,
        invited_user_id: inviteOnDb.invited_user_id,
        responded_at: inviteOnDb.responded_at,
        created_at: inviteOnDb.created_at,
        updated_at: inviteOnDb.updated_at,
        deleted_at: inviteOnDb.deleted_at,
      },
      inviteOnDb.id,
    );

    return { organizationInvite };
  },

  async persist({ organizationInvite }) {
    function mapToDbModel(organizationInvite: OrganizationInvite) {
      return {
        id: organizationInvite.id,
        email: organizationInvite.email,
        status: organizationInvite.status,
        organization_id: organizationInvite.organization_id,
        invited_by_user_id: organizationInvite.invited_by_user_id,
        invited_user_id: organizationInvite.invited_user_id,
        responded_at: organizationInvite.responded_at,
        created_at: organizationInvite.created_at,
        updated_at: organizationInvite.updated_at,
        deleted_at: organizationInvite.deleted_at,
      };
    }

    if (organizationInvite.isNewEntity) {
      await db.organizationInvite.create({
        data: mapToDbModel(organizationInvite),
      });
    }

    if (organizationInvite.isUpdatedRecently) {
      await db.organizationInvite.update({
        where: {
          id: organizationInvite.id,
        },
        data: mapToDbModel(organizationInvite),
      });
    }

    organizationInvite.forceNotNew();

    return { organizationInvite };
  },
};

const organizationInviteActions = {
  async createInvite({
    organizationId,
    invitedByUserId,
    email,
  }: {
    organizationId: string;
    invitedByUserId: string;
    email: string;
  }) {
    const normalizedEmail = organizationInviteFns.normalizeEmail(email);

    const userOnDb = await db.user.findFirst({
      where: {
        email: normalizedEmail,
        deleted_at: null,
      },
    });

    if (!userOnDb) {
      throw new ValidationError({
        message: "Usuario convidado nao encontrado.",
        action: "Use o e-mail de um usuario ja cadastrado.",
      });
    }

    const pendingInvite = await db.organizationInvite.findFirst({
      where: {
        organization_id: organizationId,
        invited_user_id: userOnDb.id,
        status: "pending",
        deleted_at: null,
      },
    });

    if (pendingInvite) {
      throw new ValidationError({
        message: "Ja existe um convite pendente para este usuario.",
        action: "Aguarde a resposta do convite atual.",
      });
    }

    const memberOnDb = await db.member.findFirst({
      where: {
        org_id: organizationId,
        user_id: userOnDb.id,
        deleted_at: null,
      },
    });

    if (memberOnDb) {
      throw new ValidationError({
        message: "Usuario ja faz parte desta organizacao.",
        action: "Use outro e-mail para enviar o convite.",
      });
    }

    const organizationInvite = OrganizationInvite.create({
      email: normalizedEmail,
      organization_id: organizationId,
      invited_by_user_id: invitedByUserId,
      invited_user_id: userOnDb.id,
      status: "pending",
      responded_at: null,
      created_at: date.nowUtcDate(),
      updated_at: null,
      deleted_at: null,
    });

    await organizationInviteFns.persist({ organizationInvite });

    return { organizationInvite };
  },

  async listPendingInvitesByUserId({ userId }: { userId: string }) {
    const invitesOnDb = await db.organizationInvite.findMany({
      where: {
        invited_user_id: userId,
        status: "pending",
        deleted_at: null,
        organization: {
          deleted_at: null,
        },
      },
      include: {
        organization: true,
        invited_by_user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      invites: invitesOnDb.map((inviteOnDb) => ({
        id: inviteOnDb.id,
        email: inviteOnDb.email,
        status: inviteOnDb.status,
        created_at: inviteOnDb.created_at,
        organization: {
          id: inviteOnDb.organization.id,
          name: inviteOnDb.organization.name,
        },
        invited_by_user: {
          id: inviteOnDb.invited_by_user.id,
          name: inviteOnDb.invited_by_user.name,
          email: inviteOnDb.invited_by_user.email,
        },
      })),
    };
  },

  async acceptInvite({ inviteId, user }: { inviteId: string; user: User }) {
    const { organizationInvite } =
      await organizationInviteFns.findPendingByIdAndUserId({
        id: inviteId,
        userId: user.id,
      });

    const memberOnDb = await db.member.findFirst({
      where: {
        org_id: organizationInvite.organization_id,
        user_id: user.id,
        deleted_at: null,
      },
    });

    if (!memberOnDb) {
      await memberMod.create({
        user_id: user.id,
        org_id: organizationInvite.organization_id,
        features: ["read:session", "read:organization"],
      });
    }

    organizationInvite.markAsAccepted();
    await organizationInviteFns.persist({ organizationInvite });

    return { organizationInvite };
  },

  async rejectInvite({ inviteId, user }: { inviteId: string; user: User }) {
    const { organizationInvite } =
      await organizationInviteFns.findPendingByIdAndUserId({
        id: inviteId,
        userId: user.id,
      });

    organizationInvite.markAsRejected();
    await organizationInviteFns.persist({ organizationInvite });

    return { organizationInvite };
  },
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
      const memberResult = await safeCall(() =>
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
    ...organizationInviteActions,

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
