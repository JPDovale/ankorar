import z from "zod";

export const listOrganizationInvitesResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      invites: z.array(
        z.object({
          id: z.uuidv7(),
          email: z.email(),
          status: z.string(),
          created_at: z.date(),
          organization: z.object({
            id: z.uuidv7(),
            name: z.string().min(3).max(256).trim(),
          }),
          invited_by_user: z.object({
            id: z.uuidv7(),
            name: z.string().min(1).max(256).trim(),
            email: z.email(),
          }),
        }),
      ),
    }),
  }),
  403: z.object({
    status: z.number().min(403).max(403),
    error: z.any(),
  }),
};
