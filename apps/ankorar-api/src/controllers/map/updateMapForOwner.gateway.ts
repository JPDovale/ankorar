import z from "zod";
import { updateMapContentBody } from "./updateMapContent.gateway";

export const updateMapForOwnerResponses = {
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

export const updateMapForOwnerParams = z.object({
  map_id: z.uuidv7(),
});

export const updateMapForOwnerBody = updateMapContentBody;
