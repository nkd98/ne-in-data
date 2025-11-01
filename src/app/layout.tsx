import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const bodyFont = Inter({ 
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Northeast in Data",
    template: "%s | Northeast in Data",
  },
  description: "Understanding the economy, people, and environment of India's North-East through open data.",
  openGraph: {
    title: "Northeast in Data",
    description: "Understanding the economy, people, and environment of India's North-East through open data.",
    url: siteUrl,
    siteName: "Northeast in Data",
    images: [
      {
        url: '/og-fallback.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northeast in Data",
    description: "Understanding the economy, people, and environment of India's North-East through open data.",
    images: ['/og-fallback.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(bodyFont.variable, displayFont.variable)} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
