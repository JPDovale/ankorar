import z from "zod";

export const listUserOrganizationsResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      organizations: z.array(
        z.object({
          id: z.uuidv7(),
          name: z.string().min(3).max(256).trim(),
          role: z.string(),
          member_id: z.uuidv7(),
          features: z.array(z.string()),
          is_current: z.boolean(),
        }),
      ),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
