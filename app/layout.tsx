import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ============================================
// Font Configuration
// Using Geist fonts for a modern, clean look
// ============================================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================
// Metadata for SEO and Social Sharing
// ============================================
export const metadata: Metadata = {
  title: "Knowrex - Intelligent Customer Support",
  description: "AI-powered customer support chatbot that helps businesses provide instant, accurate responses to customer inquiries.",
  keywords: ["AI chatbot", "customer support", "business assistant", "Gemini AI"],
  authors: [{ name: "Knowrex" }],
  openGraph: {
    title: "Knowrex - Intelligent Customer Support",
    description: "AI-powered customer support chatbot for businesses",
    type: "website",
  },
};

// ============================================
// Root Layout Component
// Wraps all pages with consistent styling and fonts
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
