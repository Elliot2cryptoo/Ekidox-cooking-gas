import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ekidox - Cooking Gas Delivered to Your Door in Lagos",
    template: "%s | Ekidox",
  },
  description:
    "Ekidox delivers cooking gas to homes and businesses across Lagos. Order 1kg, 3kg, 5kg, 6kg, 12.5kg, and 25kg gas cylinders online. Fast, safe, and reliable delivery.",
  keywords: [
    "cooking gas",
    "gas cylinder",
    "Lagos",
    "Nigeria",
    "gas delivery",
    "LPG",
    "refill",
  ],
  openGraph: {
    title: "Ekidox - Cooking Gas Delivered to Your Door",
    description:
      "Order cooking gas online. Fast, safe, and reliable delivery across Lagos.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
