import type { OrganizationMember } from "../models";

export const organizationMembers: OrganizationMember[] = [
  {
    id: "member-1",
    type: "member",
    name: "Joao Silva",
    email: "joao@ankorar.com",
    role: "owner",
    status: "active",
  },
  {
    id: "member-2",
    type: "member",
    name: "Maria Costa",
    email: "maria@ankorar.com",
    role: "admin",
    status: "active",
  },
  {
    id: "member-3",
    type: "invite",
    name: "Pedro Lima",
    email: "pedro@ankorar.com",
    role: "member",
    status: "invited",
  },
];
