import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TxStatusModal } from "@/components/web3/TxStatusModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shikkhak — AI-Powered Learn-to-Earn Platform on Stellar Soroban",
  description:
    "Master Web3 & Soroban smart contracts with AI-personalized learning paths, dynamic anti-memorization quizzes, real-time anti-cheat telemetry, and blockchain-verified token rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#080c14] text-slate-100 antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <TxStatusModal />
      </body>
    </html>
  );
}
