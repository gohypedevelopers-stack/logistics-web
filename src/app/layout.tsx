import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ship2sell Logistics",
  description: "Global logistics platform for shipment management, tracking, rates, and operations.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isJwtDecryptError =
      errorMessage.includes("JWT_SESSION_ERROR") ||
      errorMessage.includes("decryption operation failed");

    if (isJwtDecryptError) {
      console.warn("[AUTH] Ignoring invalid session token. Continuing as logged-out user.");
    } else {
      throw error;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}

