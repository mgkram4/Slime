import Image from "next/image";
import { SearchTypes } from "@/types/SearchTypes";
import formatPrice from "@/util/PriceFormats";
import AddCart from "./AddCart";

export default async function Product({ searchParams }: SearchTypes) {
  return (
    <div className="flex flex-col justify-between  text-gray-700 space-y-4 items-center bg-slate-100 rounded-xl">
      <h1 className="font-bold text-2xl">{searchParams.name}</h1>
      <Image
        src={searchParams.image}
        height={600}
        width={600}
        className="w-full object-cover rounded-xl shadow-sm"
        alt={""}
      />
      <p className="">{searchParams.description}</p>
      <div className="flex gap-2 ">
        <p className="font-bold text-teal-700">
          {searchParams.unit_amount !== null
            ? formatPrice(searchParams.unit_amount)
            : "N/A"}
        </p>
      </div>
      <AddCart {...searchParams} />
    </div>
  );
}
