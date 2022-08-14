import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const pasteRouter = createRouter()
    .mutation("create", {
        input: z.object({ text: z.string() }),
        async resolve({ input, ctx }) {
            try {
                const { text } = input;
                const paste = await ctx.prisma.paste.create({
                    data: {
                        text,
                        createdAt: new Date(),
                    },
                });

                return paste;
            } catch (e) {
                console.log(e);

                throw new TRPCError({
                    message: "Error creating paste",
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        },
    })
    .query("get-all", {
        async resolve({ ctx }) {
            const pastes = await ctx.prisma.paste.findMany();

            return pastes;
        },
    });
