import { activateUserById } from "./activateUserById";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";
import { hashUserPassword } from "./hashUserPassword";
import { updateUser } from "./updateUser";
import { validateUserUniqueEmail } from "./validateUserUniqueEmail";
import { findUserByEmail } from "./fns/findUserByEmail";
import { findUserByExtId } from "./fns/findUserByExtId";
import { findUserById } from "./fns/findUserById";
import { persistUser } from "./fns/persistUser";

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
    persist: persistUser,
  },
};

export { Users };
