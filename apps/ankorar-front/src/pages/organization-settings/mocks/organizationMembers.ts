import type { OrganizationMember } from "../models";

export const organizationMembers: OrganizationMember[] = [
  {
    id: "member-1",
    name: "Joao Silva",
    email: "joao@ankorar.com",
    role: "owner",
    status: "active",
  },
  {
    id: "member-2",
    name: "Maria Costa",
    email: "maria@ankorar.com",
    role: "admin",
    status: "active",
  },
  {
    id: "member-3",
    name: "Pedro Lima",
    email: "pedro@ankorar.com",
    role: "member",
    status: "invited",
  },
];
