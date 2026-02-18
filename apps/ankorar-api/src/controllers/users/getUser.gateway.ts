import z from "zod";

export const getUserResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      user: z.object({
        id: z.uuidv7(),
        email: z
          .email()
          .trim()
          .transform((email) => email.toLocaleLowerCase()),
        created_at: z.date(),
        updated_at: z.date().nullable(),
        name: z.string().min(3).max(256).trim(),
      }),
      features: z.array(z.string()),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    errors: z.any(),
  }),
};
