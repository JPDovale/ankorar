import z from "zod";

export const updateUserPasswordBody = z.object({
  current_password: z.string().min(1, "Senha atual é obrigatória"),
  new_password: z.string().min(8).max(60).trim(),
});

export const updateUserPasswordResponses = {
  204: z.object({
    status: z.number().min(204).max(204),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
