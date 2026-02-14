import { createSession } from "./createSession";
import { createSessionForUser } from "./createSessionForUser";
import { logoutSession } from "./logoutSession";
import { refreshSession } from "./refreshSession";
import { deleteSessionByRefreshTokenAndUserId } from "./fns/deleteSessionByRefreshTokenAndUserId";
import { findValidSessionByTokenAndUserId } from "./fns/findValidSessionByTokenAndUserId";
import { persistSession } from "./fns/persistSession";

const Sessions = {
  create: createSession,
  createForUser: createSessionForUser,
  logout: logoutSession,
  refresh: refreshSession,
  fns: {
    findValidByTokenAndUserId: findValidSessionByTokenAndUserId,
    deleteByRefreshTokenAndUserId: deleteSessionByRefreshTokenAndUserId,
    persist: persistSession,
  },
};

export { Sessions };
