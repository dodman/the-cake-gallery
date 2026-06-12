import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/store/auth";
import { CartProvider } from "@/store/cart";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const siteUrl = "https://thecakegallery.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "The Cake Gallery", template: "%s · The Cake Gallery" },
  description: "Luxury cakes, pastries and cooked meals for delivery and pickup in Zambia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "The Cake Gallery",
    title: "The Cake Gallery",
    description: "Luxury cakes, pastries and cooked meals for delivery and pickup in Zambia."
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cake Gallery",
    description: "Luxury cakes, pastries and cooked meals for delivery and pickup in Zambia."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
