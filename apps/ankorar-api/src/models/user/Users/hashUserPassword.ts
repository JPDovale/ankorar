import { cryptoModule } from "../../crypto/CryptoModule";
import { User } from "./User";

type HashUserPasswordInput = {
  user: User;
};

type HashUserPasswordResponse = {
  user: User;
};

export async function hashUserPassword({
  user,
}: HashUserPasswordInput): Promise<HashUserPasswordResponse> {
  const { Crypto } = cryptoModule;

  if (user.password) {
    const passwordHashed = await Crypto.fns.hashPassword({
      password: user.password,
    });

    user.password = passwordHashed;
  }

  return { user };
}
