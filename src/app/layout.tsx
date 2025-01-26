import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BizSim - Business Simulation Dashboard",
  description: "Interactive business simulation with real-time scenarios and AI-powered insights",
};

// Remove dynamic styles and handle browser extension modifications
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
