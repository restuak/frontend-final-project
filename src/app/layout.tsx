import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "RESTIFY | Find the best deals for hotels, motels, and more",
  description:
    "Find the best deals for hotels, motels, and more. Compare prices easily with Restify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${poppins.variable} antialiased bg-[#FFFAFA] text-[#25171A] flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 bg-[#ffffff]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
