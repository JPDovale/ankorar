import z from "zod";

export const updateNoteResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const updateNoteParams = z.object({
  note_id: z.uuidv7(),
});

export const updateNoteBody = z
  .object({
    title: z.string().min(1).max(256).trim().optional(),
    text: z.string().trim().optional(),
  })
  .refine((data) => data.title !== undefined || data.text !== undefined, {
    message: "Pelo menos um de title ou text deve ser informado",
  });
