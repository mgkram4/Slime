import { Metadata } from "next";

export type ProductType = {
  name: string;
  image: string;
  description: string | null;
  unit_amount: number | null;
  id: string;
  quantity?: number | 1;
  metadata: MetadataType;
};

type MetadataType = {
  features: string;
};
