import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Startup Projection Calculator",
  description: "A tool to calculate and visualize startup financial projections.",
  openGraph: {
    title: 'Startup Projection Calculator',
    description: 'A tool to calculate and visualize startup financial projections.',
    url: 'https://catipult-projector.vercel.app/',
    images: [
      {
        url: 'https://catipult-projector.vercel.app/header.jpg',
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Projection Calculator',
    description: 'A tool to calculate and visualize startup financial projections.',
    images: ['https://catipult-projector.vercel.app/header.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
