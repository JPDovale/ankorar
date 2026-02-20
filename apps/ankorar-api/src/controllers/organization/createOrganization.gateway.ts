import z from "zod";

export const createOrganizationBody = z.object({
  name: z.string().min(1).max(256).trim(),
});

export const createOrganizationResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.object({
      organization_id: z.string().uuid(),
      name: z.string(),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  403: z.object({
    status: z.number().min(403).max(403),
    error: z.any(),
  }),
};
