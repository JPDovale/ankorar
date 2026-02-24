import z from "zod";

export const listMapsByLibraryIdsQuerystring = z.object({
  library_ids: z.preprocess(
    (v) => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []),
    z.array(z.uuidv7()).min(1).max(100),
  ),
});

export const listMapsByLibraryIdsResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      libraries: z.array(
        z.object({
          id: z.uuidv7(),
          name: z.string().min(1).max(256).trim(),
          created_at: z.date(),
          updated_at: z.date().nullable(),
          maps: z.array(
            z.object({
              id: z.uuidv7(),
              title: z.string().min(1).max(256).trim(),
              created_at: z.date(),
              updated_at: z.date().nullable(),
              likes_count: z.number().int().min(0),
              liked_by_me: z.boolean(),
              preview: z.string().nullable(),
              generated_by_ai: z.boolean(),
            }),
          ),
        }),
      ),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
