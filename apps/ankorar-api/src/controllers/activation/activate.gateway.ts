import z from "zod";

export const activateResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};

export const activateParams = z.object({
  token_id: z.uuidv7(),
});
