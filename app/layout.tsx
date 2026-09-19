import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

// ============================================
// Font Configuration
// Using Plus Jakarta Sans for an ultra-aesthetic, modern tech feel
// ============================================
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap"
});

// ============================================
// Metadata for SEO and Social Sharing
// ============================================
export const metadata: Metadata = {
  title: "Knowrex - Intelligent Enterprise Support Platform",
  description: "Enterprise-grade AI customer support engine with Pinecone Cloud RAG, real-time human escalation, AI safety guardrails, and automated knowledge discovery.",
  keywords: ["AI chatbot", "customer support", "Pinecone RAG", "Gemini AI", "Guardrails"],
  authors: [{ name: "Knowrex" }],
  openGraph: {
    title: "Knowrex - Intelligent Enterprise Support Platform",
    description: "Enterprise-grade AI customer support engine with Pinecone Cloud RAG and AI Guardrails",
    type: "website",
  },
};

// ============================================
// Root Layout Component
// Wraps all pages with Obsidian Glass ambient layers & typography
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400`}
      >
        {/* Global Ambient Lighting Mesh */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-70 dark:opacity-35 transition-opacity duration-700">
          <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-indigo-500/20 via-purple-600/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute top-[60%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-1 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
