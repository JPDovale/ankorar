import z from "zod";

const organizationMemberSchema = z.object({
  id: z.string(),
  type: z.enum(["member", "invite"]),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member"]),
  status: z.enum(["active", "invited"]),
});

export const listOrganizationMembersResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      members: z.array(organizationMemberSchema),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};
