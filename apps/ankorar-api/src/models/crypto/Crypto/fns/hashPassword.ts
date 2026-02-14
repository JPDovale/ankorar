import { hash } from "bcryptjs";
import { getRounds } from "./getRounds";

type HashPasswordInput = {
  password: string;
};

type HashPasswordResponse = Promise<string>;

export async function hashPassword({
  password,
}: HashPasswordInput): HashPasswordResponse {
  const passwordPepper = password + process.env.PEPPER;
  const passwordHashed = await hash(passwordPepper, getRounds());
  return passwordHashed;
}
