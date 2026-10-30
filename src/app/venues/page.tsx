import type { Metadata } from "next";
import { VenueOwnerPage } from "@/components/venues/VenueOwnerPage";

export const metadata: Metadata = {
  title: "For Venue Owners — JusGo",
  description:
    "See how the JusGo Venue Owner portal works: onboarding, your dashboard, venues, playing areas, bookings, staff and plans, all in one place. Aakavi presents JusGo.",
};

export default function Venues() {
  return <VenueOwnerPage />;
}
