import { z } from "zod";

export const checkoutSchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  method: z.enum(["pix", "room_charge"]),
  items: z
    .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30),
});

export const supportSchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  kind: z.enum(["restock", "damaged", "door_problem"]),
  note: z.string().max(300).optional(),
  transactionToken: z.string().min(1).max(64).optional(),
});

export const rfidSchema = z.object({
  deviceId: z.string().min(1),
  uid: z.string().min(4).max(32),
});

export const pixWebhookSchema = z.object({
  event: z.string(),
  payment: z.object({ id: z.string(), externalReference: z.string().nullish(), status: z.string().nullish() }),
});
