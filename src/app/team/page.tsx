import type { Metadata } from "next";
import { TeamPage } from "@/components/BrandPages";

export const metadata: Metadata = {
  title: "Our Team — JusGo",
  description:
    "Meet the people and disciplines building JusGo, a more connected booking experience for sports venues and platforms. Aakavi presents JusGo.",
};

export default function Team() {
  return <TeamPage />;
}
