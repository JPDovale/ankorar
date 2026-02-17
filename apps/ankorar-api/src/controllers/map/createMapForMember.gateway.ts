import z from "zod";

export const createMapForMemberResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
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

export const createMapForMemberParams = z.object({
  member_id: z.uuidv7(),
});

export const createMapForMemberBody = z.object({
  title: z.string().min(1).max(256).trim(),
  library_id: z.uuidv7().optional(),
});
