import { ValidationError } from "@/src/infra/errors/ValidationError";
import z from "zod";

type VerifyUUIDIsValidInput = {
  uuid: string;
};

type VerifyUUIDIsValidResponse = void;

export function verifyUUIDIsValid({
  uuid,
}: VerifyUUIDIsValidInput): VerifyUUIDIsValidResponse {
  const uuidValidator = z.uuidv7();

  const { success } = uuidValidator.safeParse(uuid);

  if (!success) {
    throw new ValidationError({
      message: "Verify id of entities sended",
    });
  }
}
