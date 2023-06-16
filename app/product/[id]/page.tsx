import Image from "next/image";
import { SearchTypes } from "@/types/SearchTypes";
import formatPrice from "@/util/PriceFormats";

export default async function Product({ searchParams }: SearchTypes) {
  return (
    <div className="flex-col justify-between gap-24 p-12 text-gray-700 space-y-4 items-center">
      <h1 className="">{searchParams.name}</h1>
      <Image
        src={searchParams.image}
        height={600}
        width={600}
        className="w-full h-80 object-cover rounded-xl shadow-sm"
        alt={""}
      />
      <p className="">{searchParams.description}</p>
      <div className="flex gap-2 ">
        <p className="font-bold text-teal-700">
          {formatPrice(searchParams.unit_amount)}
        </p>
      </div>
      <button className="my-12 text-white py-2 px-6 font-bold rounded-lg bg-teal-700 hover:opacity-70">
        Add to Cart{" "}
      </button>
    </div>
  );
}
