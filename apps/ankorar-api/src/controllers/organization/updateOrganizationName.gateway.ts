import z from "zod";

export const updateOrganizationNameBody = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(120, "Nome deve ter no máximo 120 caracteres"),
});

export const updateOrganizationNameResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};
