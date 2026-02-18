import { getFrontendOrigin } from "./getFrontendOrigin";
import { getOrigin } from "./getOrigin";

const Webserver = {
  origin: getOrigin(),
  frontendOrigin: getFrontendOrigin(),
  fns: {
    getOrigin,
    getFrontendOrigin,
  },
};

export { Webserver };
