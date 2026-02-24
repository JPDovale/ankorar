import z from "zod";

export const createMapFromAiForMemberParams = z.object({
  member_id: z.uuidv7(),
});

export const createMapFromAiForMemberResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.object({
      map_id: z.uuidv7(),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
  422: z.object({
    status: z.number().min(422).max(422),
    error: z.any(),
  }),
  502: z.object({
    status: z.number().min(502).max(502),
    error: z.any(),
  }),
};

export const createMapFromAiForMemberBody = z.object({
  description: z.string().min(1).max(120_000).trim(),
  title: z.string().min(1).max(256).trim().optional(),
});
