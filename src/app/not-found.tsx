import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Page not found — JusGo",
};

export default function NotFound() {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar />
      <main className="pt-20">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
