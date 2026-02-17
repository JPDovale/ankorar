import z from "zod";
import { updateMapContentBody } from "./updateMapContent.gateway";

export const updateMapForMemberResponses = {
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

export const updateMapForMemberParams = z.object({
  member_id: z.uuidv7(),
  map_id: z.uuidv7(),
});

export const updateMapForMemberBody = updateMapContentBody;
