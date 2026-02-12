import z from "zod";

export const createLibraryResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};

export const createLibraryBody = z.object({
  name: z.string().min(1).max(256).trim(),
});
