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
  /** Path from root (central) to the node's parent. Each item is the text of a node. Enables better AI context. */
  contextPath: z.array(z.string()).optional(),
});

export type DeepenMapNodeForOwnerBody = z.infer<typeof deepenNodeBodySchema>;

export const deepenMapNodeForOwnerParams = z.object({
  map_id: z.uuidv7(),
});

export const deepenMapNodeForOwnerBody = deepenNodeBodySchema;

export const deepenMapNodeForOwnerResponses = {
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
