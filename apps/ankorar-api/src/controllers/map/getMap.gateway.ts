import z from "zod";

export const getMapResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      map: z.object({
        id: z.uuidv7(),
        title: z.string().min(1).max(256).trim(),
        content: z.array(z.unknown()),
        created_at: z.date(),
        updated_at: z.date().nullable(),
      }),
    }),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const getMapParams = z.object({
  map_id: z.uuidv7(),
});
