import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { AuthService } from "@/lib/services/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Initialize auth service with environment variables
const authService = new AuthService({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  scopes: ['email', 'profile']
});

export const metadata: Metadata = {
  title: "BizSim - Business Simulation Dashboard",
  description: "Interactive business simulation with real-time scenarios and AI-powered insights",
};

// Root layout with auth provider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white`} suppressHydrationWarning>
        <AuthProvider authService={authService}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
