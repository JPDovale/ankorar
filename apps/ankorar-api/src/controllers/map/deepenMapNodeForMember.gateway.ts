import z from "zod";

const deepenNodeBodySchema = z.object({
  node: z.object({
    id: z.string().min(1),
    text: z.string(),
    style: z
      .object({
        color: z.string().optional(),
      })
      .optional(),
  }),
  contextPath: z.array(z.string()).optional(),
});

export const deepenMapNodeForMemberParams = z.object({
  member_id: z.uuidv7(),
  map_id: z.uuidv7(),
});

export const deepenMapNodeForMemberBody = deepenNodeBodySchema;

export const deepenMapNodeForMemberResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      newChildren: z.array(z.unknown()),
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
  502: z.object({
    status: z.number().min(502).max(502),
    error: z.any(),
  }),
};
