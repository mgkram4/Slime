import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secrect: process.env.NEXTAUTH_SECRECT,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add more providers
  ],
  events: {
    createUser: async ({ user }: { user: any }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-11-15",
      });
      // create a stripe customer
      if (user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        // update Prisma user with the Stripe customerId
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });
      }
    },
  },
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
