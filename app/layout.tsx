import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

/* Toyota Type — the corporate typeface (Toyota brand guideline), self-hosted.
   Book=400, Regular=500, Semibold=600, Bold=700. Arial is Toyota's sanctioned
   system fallback (used for the size-adjusted metric fallback too). */
const toyotaType = localFont({
  variable: "--font-toyota-sans",
  display: "swap",
  fallback: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
  src: [
    { path: "./fonts/ToyotaType-Book.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ToyotaType-Regular.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ToyotaType-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ToyotaType-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/* Toyota Script — restricted to the "Let's Go Places" signature tagline only. */
const toyotaScript = localFont({
  variable: "--font-toyota-script",
  display: "swap",
  src: [{ path: "./fonts/ToyotaScript2.woff2", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.toyota-bd.com"),
  title: {
    default: "Toyota Bangladesh — Let's Go Places",
    template: "%s | Toyota Bangladesh",
  },
  description:
    "Explore the Toyota range in Bangladesh. Hybrid SUVs, sedans and pickups engineered for Bangladesh's roads. Book a test drive, shop genuine parts and schedule a service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${toyotaType.variable} ${toyotaScript.variable} antialiased`}
    >
      <body>
        <LenisProvider>
          <ScrollProgress />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
