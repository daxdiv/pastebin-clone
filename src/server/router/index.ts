// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { pasteRouter } from "./paste";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("paste.", pasteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
