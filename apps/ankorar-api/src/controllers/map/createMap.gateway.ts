import z from "zod";

export const createMapResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};

export const createMapBody = z.object({
  title: z.string().min(1).max(256).trim(),
});
