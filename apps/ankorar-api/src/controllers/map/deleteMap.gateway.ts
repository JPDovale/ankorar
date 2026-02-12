import z from "zod";

export const deleteMapResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const deleteMapParams = z.object({
  map_id: z.uuidv7(),
});
