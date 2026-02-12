import z from "zod";

export const createOrganizationInviteResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};

export const createOrganizationInviteBody = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),
});
