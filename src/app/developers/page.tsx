import type { Metadata } from "next";
import { DeveloperPage } from "@/components/developers/DeveloperPage";

export const metadata: Metadata = {
  title: "For Developers — JusGo",
  description:
    "Connect your booking app to JusGo: the five-step integration journey, how a slot is sold once and blocked everywhere, and the Partner API. Aakavi presents JusGo.",
};

export default function Developers() {
  return <DeveloperPage />;
}
