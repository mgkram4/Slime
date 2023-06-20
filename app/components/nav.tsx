"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { useCartStore } from "@/store";
import { AiFillShopping } from "react-icons/ai";
import luxary from "@public/holder.png";
import { AnimatePresence, motion } from "framer-motion";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <>
      <nav className="flex justify-between items-center py-12">
        <Link href={"/"}>
          <h1>DIOR</h1>
        </Link>
        {/* Toggle Cart */}
        <ul className="flex space-x-10">
          {/* if the user is not signed in */}
          <li
            onClick={() => cartStore.toggleCart()}
            className="flex items-center text-3xl relative cursor-pointer"
          >
            <AiFillShopping />
            <AnimatePresence>
              {cartStore.cart.length > 0 && (
                <motion.span
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  exit={{ scale: 0 }}
                  className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center"
                >
                  {cartStore.cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </li>
          {!user && (
            <li className="bg-teal-600 text-white py-2 px-4 rounded-xl hover:opacity-75">
              <button onClick={() => signIn()} className="">
                Sign In
              </button>
            </li>
          )}
          {/* if the user is signed in */}
          {user && (
            <li>
              <Image
                src={user?.image as string}
                alt={user.name as string}
                width={40}
                height={48}
                className="rounded-full"
              />
            </li>
          )}
        </ul>
        <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
      </nav>
    </>
  );
}
