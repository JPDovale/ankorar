import { createServerInstance } from "./server";

export const app = createServerInstance();

const port = process.env.PORT ? Number(process.env.PORT) : undefined;
const host = process.env.HOST ?? "0.0.0.0";

app
  .listen(port, host)
  .catch((err) => {
    console.error(err);
    throw err;
  });
