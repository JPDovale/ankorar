import { getOrigin } from "./getOrigin";

const Webserver = {
  origin: getOrigin(),
  fns: {
    getOrigin,
  },
};

export { Webserver };
