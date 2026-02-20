import { activateUserById } from "./activateUserById";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";
import { hashUserPassword } from "./hashUserPassword";
import { updateUser } from "./updateUser";
import { validateUserUniqueEmail } from "./validateUserUniqueEmail";
import { findUserByEmail } from "./fns/findUserByEmail";
import { findUserByExtId } from "./fns/findUserByExtId";
import { findUserById } from "./fns/findUserById";
import { consumeAiCredit } from "./fns/consumeAiCredit";
import { findManyPaginated } from "./fns/findManyPaginated";
import { findUserByStripeCustomerId } from "./fns/findUserByStripeCustomerId";
import { persistUser } from "./fns/persistUser";
import { updateUserSubscriptionFields } from "./fns/updateUserSubscriptionFields";

const Users = {
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  activateById: activateUserById,
  hashPassword: hashUserPassword,
  validateUniqueEmail: validateUserUniqueEmail,
  fns: {
    findByEmail: findUserByEmail,
    findById: findUserById,
    findByExtId: findUserByExtId,
    findByStripeCustomerId: findUserByStripeCustomerId,
    findManyPaginated,
    persist: persistUser,
    updateSubscriptionFields: updateUserSubscriptionFields,
    consumeAiCredit,
  },
};

export { Users };
