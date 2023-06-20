"use client";

import { useCartStore } from "@/store";
import { AddCartType } from "@/types/AddCartTypes";
import { useState } from "react";

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity,
}: AddCartType) {
  const cartStore = useCartStore();

  return (
    <>
      <button
        onClick={() =>
          cartStore.addProduct({ id, image, unit_amount, quantity, name })
        }
        className="my-12 text-white bg-teal-700 py-2 px-6 font-medium rounded-md"
      >
        Add to Cart
      </button>
    </>
  );
}
