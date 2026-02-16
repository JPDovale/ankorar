import z from "zod";

export const likeMapResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      map_like: z.object({
        id: z.uuidv7(),
        map_id: z.uuidv7(),
        member_id: z.uuidv7(),
        created_at: z.date(),
      }),
    }),
  }),
  403: z.object({
    status: z.number().min(403).max(403),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const likeMapParams = z.object({
  map_id: z.uuidv7(),
});
