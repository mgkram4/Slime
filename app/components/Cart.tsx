"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/util/PriceFormats";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import luxary from "@/public/fashion.png";
import { AnimatePresence, motion } from "framer-motion";
import Checkout from "./Checkout";

export default function Cart() {
  const cartStore = useCartStore();

  // Price
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      {/* Cart */}
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-white absolute right-0 top-0 w-full lg:w-1/5 h-screen p-12 overflow-y-scroll text-gray-700"
      >
        <h1 className="text-5xl flex justify-center">🎒</h1>
        <button
          onClick={() => cartStore.toggleCart()}
          className="text-sm font-bold pb-12"
        >
          Back to Store
        </button>
        {/* Cart Items */}
        {cartStore.onCheckout === "cart" && (
          <>
            {cartStore.cart.map((item) => (
              <motion.div key={item.id} layout className="flex py-4 gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={220}
                  height={220}
                  className="rounded-xl object-cover"
                />
                <motion.div layout className="py-2 flex-col">
                  <h2>{item.name}</h2>
                  <div className="flex gap-2 text-md">
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoRemoveCircle />
                    </button>
                    <button
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoAddCircle />
                    </button>
                  </div>

                  <p className="text-sm">
                    {item.unit_amount && formatPrice(item.unit_amount)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </>
        )}
        {/* Checkout and total */}
        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" ? (
          <motion.div layout>
            <p>Total: {formatPrice(totalPrice)}</p>
            <button
              onClick={() => cartStore.setCheckout("checkout")}
              className="py-2 mt-4 bg-primary w-full rounded-md text-black"
            >
              Checkout
            </button>
          </motion.div>
        ) : null}
        {/* Checkout Form */}
        {!(cartStore.onCheckout === "checkout") && <Checkout />}
        {/* {cartStore.onCheckout === "success" && <OrderConfirmed />} */}
        <AnimatePresence>
          {!cartStore.cart.length && (
            <motion.div
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-70"
            >
              <Image src={luxary} alt="luxary" width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
