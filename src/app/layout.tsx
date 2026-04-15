import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remove Image Background Online Free",
  description:
    "Remove image backgrounds instantly online. Upload your photo, erase the background with AI, and download a transparent PNG in seconds.",
  keywords: [
    "image background remover",
    "remove background from image",
    "transparent background maker",
    "remove background online",
  ],
  openGraph: {
    title: "Remove Image Background Instantly",
    description:
      "Upload your image, remove the background with AI, and download a transparent PNG in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Image Background Instantly",
    description:
      "Upload your image, remove the background with AI, and download a transparent PNG in seconds.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
