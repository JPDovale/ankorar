import z from "zod";

export const loginResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.null(),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};

export const loginBody = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(60).trim(),
});
