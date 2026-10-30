import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { IntroLoader } from "@/components/IntroLoader";
import { ScrollTop } from "@/components/ScrollTop";
import { PageEffects } from "@/components/PageEffects";
import { PageTransition } from "@/components/PageTransition";
import { Cursor } from "@/components/Cursor";
import { SmoothScrollProvider } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Meet JusGo — A better-connected way to play",
  authors: [{ name: "Aakavi" }],
  creator: "Aakavi",
  description:
    "Aakavi presents JusGo, the booking infrastructure connecting sports venues and booking apps. Manage availability, pricing, and bookings in one connected platform.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/assets/jusgo-logo.png" as="image" />
        <link rel="preload" href="/assets/loader-bg.webp" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <noscript><style>{`.intro-loader{display:none}`}</style></noscript>
      </head>
      <body>
        <IntroLoader />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <PageTransition />
        <PageEffects />
        <ScrollTop />
        <Cursor />
      </body>
    </html>
  );
}
