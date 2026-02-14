import { comparePassword } from "./fns/comparePassword";
import { createId } from "./fns/createId";
import { getRounds } from "./fns/getRounds";
import { hashPassword } from "./fns/hashPassword";
import { verifyUUIDIsValid } from "./fns/verifyUUIDIsValid";

const Crypto = {
  fns: {
    createId,
    comparePassword,
    hashPassword,
    getRounds,
    verifyUUIDIsValid,
  },
};

export { Crypto };
