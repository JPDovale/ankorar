import z from "zod";

export const updateCurrentUserBody = z.object({
  name: z.string().min(3).max(256).trim().optional(),
  email: z
    .string()
    .email()
    .trim()
    .transform((email) => email.toLowerCase())
    .optional(),
});

export const updateCurrentUserResponses = {
  204: z.object({
    status: z.number().min(204).max(204),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  409: z.object({
    status: z.number().min(409).max(409),
    error: z.any(),
  }),
};
