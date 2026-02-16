import z from "zod";

export const unlikeMapResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      map_like: z
        .object({
          id: z.uuidv7(),
          map_id: z.uuidv7(),
          member_id: z.uuidv7(),
          created_at: z.date(),
        })
        .nullable(),
    }),
  }),
};

export const unlikeMapParams = z.object({
  map_id: z.uuidv7(),
});
