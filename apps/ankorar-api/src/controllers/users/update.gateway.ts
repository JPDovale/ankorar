import z from "zod";

export const updateUserResponses = {
  204: z.object({
    status: z.number().min(204).max(204),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
  409: z.object({
    status: z.number().min(409).max(409),
    error: z.any(),
  }),
};

export const updateUserBody = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLowerCase())
    .optional(),
  password: z.string().min(8).max(60).trim().optional(),
  name: z.string().min(3).max(256).trim().optional(),
});

export const updateUserParams = z.object({
  email: z
    .string()
    .trim()
    .min(1)
    .transform((email) => email.toLowerCase()),
});
