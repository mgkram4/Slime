import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AddCartType } from "@/types/AddCartTypes";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const prisma = new PrismaClient();

const calculateOrderAmount = (items: AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  const { items, payment_intent_id } = req.body;
  const total = calculateOrderAmount(items as AddCartType[]);

  // Create Order data
  const orderData = {
    user: { connect: { id: userSession.user?.id } },
    amount: total,
    currency: "usd",
    status: "pending",
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map(
        (item: {
          name: any;
          description: any;
          unit_amount: string;
          image: any;
          quantity: any;
        }) => ({
          name: item.name,
          description: item.description || null,
          unit_amount: parseFloat(item.unit_amount),
          image: item.image,
          quantity: item.quantity,
        })
      ),
    },
  };

  // Check if the payment intent exists
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: calculateOrderAmount(items) }
      );
      // fetch order with prod ids
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentID: updated_intent.id },
        include: { products: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid Payment Intent" });
        return;
      }
      const updated_order = await prisma.order.update({
        where: { id: existing_order.id },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map(
              (item: {
                name: any;
                description: any;
                unit_amount: string;
                image: any;
                quantity: any;
              }) => ({
                name: item.name,
                description: item.description || null,
                unit_amount: parseFloat(item.unit_amount),
                image: item.image,
                quantity: item.quantity,
              })
            ),
          },
        },
      });
      res.status(200).json({ paymentIntenet: updated_intent });
      return;
    }
  } else {
    // Create a new order
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    orderData.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(200).json({ paymentIntent });
  }
}
