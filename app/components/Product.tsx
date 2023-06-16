import Image from "next/image";
import formatPrice from "@/util/PriceFormats";
import Link from "next/link";
import { ProductType } from "@/types/ProductTypes";

export default function Product({
  name,
  image,
  unit_amount,
  id,
  description,
  metadata,
}: ProductType) {
  const { features } = metadata;
  return (
    <Link
      href={{
        pathname: "/product/${id}",
        query: { name, image, unit_amount, id, description, features },
      }}
    >
      <div className="rounded-lg shadow-md bg-white justify-center items-center p-4 ">
        <div className="text-xl font-bold mb-4">{name}</div>
        <Image
          src={image}
          height={600}
          width={600}
          className="w-full h-80 object-cover rounded-xl shadow-sm"
          alt={""}
        />
        <div className="mt-4 font-bold text-teal-700">
          {formatPrice(unit_amount as number)}
        </div>
      </div>
    </Link>
  );
}
