import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "../../auth";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { ourFileRouter } from "@/server/uploadthing";

export const adminRouter = createTRPCRouter({
  login: publicProcedure.input(z.object({email: z.string().email(), password: z.string()})).mutation(async ({ ctx, input}) => {
    const {res} = ctx;
    const {email, password} = input;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // user is authenticated as admin

      const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .sign(new TextEncoder().encode(getJwtSecretKey()))


      res.setHeader(
        'Set-Cookie',
        cookie.serialize('admin_token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2,
      })
    )

    return { success: true }
    }

    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid credentials',
    })
  }),

  sensitive: adminProcedure.mutation(() => {
    return 'sensetive'
  }),

  addMenuItem: adminProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        imageKey: z.string(),
        name: z.string(),
        price: z.number(),
        categories: z.array(z.enum(['breakfast', 'lunch', 'dinner'])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, price, categories, imageKey } = input;
      const menuItem = await ctx.prisma.MenuItem.create({
        data: {
          name: input.name,
          price: input.price,
          categories: input.categories,
          imageKey: input.imageKey,
          url: input.imageUrl,
        },
      });

      return menuItem;
    }),

    getMenuItems: adminProcedure.query(async ({ ctx }) => {
      return ctx.prisma.menuItem.findMany();
    }),

    deleteMenuItem: adminProcedure
      .input(z.object({ imageKey: z.string(), id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.prisma.menuItem.delete({ where: { id: input.id } });

        // UploadThing doesn't delete files via API directly yet — optional

        return true;
      }),


  })
