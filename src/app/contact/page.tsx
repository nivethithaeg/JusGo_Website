import type { Metadata } from "next";
import { ContactPage } from "@/components/BrandPages";

export const metadata: Metadata = {
  title: "Contact — JusGo",
  description:
    "Contact JusGo about venue partnerships, booking platform integrations, or other questions. Aakavi presents JusGo.",
};

export default function Contact() {
  return <ContactPage />;
}
