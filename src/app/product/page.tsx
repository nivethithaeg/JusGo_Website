import type { Metadata } from "next";
import { JusGoProductPage } from "@/components/ProductPage";

export const metadata: Metadata = {
  title: "JusGo Product — One platform for venues and booking apps",
  description:
    "See how JusGo brings venue owners and booking apps together through shared availability, pricing, venue approval, and booking flows. Aakavi presents JusGo.",
};

export default function Product() {
  return <JusGoProductPage />;
}
