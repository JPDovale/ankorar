import z from "zod";

export const upsertMemberResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};

export const upsertMemberBody = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLocaleLowerCase()),
  name: z.string().min(3).max(256).trim(),
  ext_id: z.string().min(8).max(46).trim(),
});
