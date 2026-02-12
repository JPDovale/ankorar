import { createServerInstance } from "./server";

export const app = createServerInstance();

app
  .run(process.env.PORT ? Number(process.env.PORT) : undefined)
  .catch((err) => {
    console.error(err);
    throw err;
  });
