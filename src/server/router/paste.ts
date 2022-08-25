import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TExpiresIn } from "../../utils/types";
import { createRouter } from "./context";

const expiresInToSecondsMap: Record<TExpiresIn, number> = {
    "1h": 3600,
    "1d": 86400,
    "1w": 604800,
    "1m": 2592000,
    "1y": 31536000,
};

export const pasteRouter = createRouter()
    .mutation("create", {
        input: z.object({
            text: z.string(),
            expiresIn: z.enum(["1h", "1d", "1w", "1m", "1y"]).default("1d"),
            password: z.string().optional(),
            locked: z.boolean().default(false),
        }),
        async resolve({ input, ctx }) {
            try {
                const { text, expiresIn, password, locked } = input;
                const paste = await ctx.prisma.paste.create({
                    data: {
                        text,
                        createdAt: new Date(),
                        password,
                        locked,
                    },
                    select: {
                        id: true,
                        text: true,
                        locked: true,
                    },
                });

                setTimeout(async () => {
                    await ctx.prisma.paste.delete({
                        where: {
                            id: paste.id,
                        },
                    });

                    console.log(`paste expired with id: ${paste.id}`);
                }, expiresInToSecondsMap[expiresIn] * 1000);

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
            const pastes = await ctx.prisma.paste.findMany({
                select: { id: true, text: true, locked: true },
            });

            return pastes;
        },
    })
    .query("get-by-id", {
        input: z.object({ id: z.string() }),
        async resolve({ input, ctx }) {
            const { id } = input;
            const paste = await ctx.prisma.paste.findUnique({
                where: { id },
                select: {
                    id: true,
                    text: true,
                    locked: true,
                },
            });

            return paste;
        },
    })
    .mutation("unlock", {
        input: z.object({ id: z.string(), password: z.string() }),
        async resolve({ input, ctx }) {
            const { id, password } = input;
            const paste = await ctx.prisma.paste.findUnique({
                where: { id },
                select: { password: true },
            });

            if (!paste) {
                throw new TRPCError({
                    message: "Paste not found",
                    code: "NOT_FOUND",
                });
            }

            if (paste.password !== password) {
                throw new TRPCError({
                    message: "Invalid password",
                    code: "UNAUTHORIZED",
                });
            }

            await ctx.prisma.paste.update({
                where: { id },
                data: { locked: false },
            });
        },
    });
