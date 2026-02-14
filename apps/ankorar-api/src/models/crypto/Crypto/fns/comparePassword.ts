import { compare } from "bcryptjs";

type ComparePasswordInput = {
  password: string;
  hash: string;
};

type ComparePasswordResponse = Promise<boolean>;

export async function comparePassword({
  password,
  hash,
}: ComparePasswordInput): ComparePasswordResponse {
  const passwordPepper = password + process.env.PEPPER;
  const match = await compare(passwordPepper, hash);
  return match;
}
