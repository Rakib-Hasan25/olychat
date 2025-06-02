import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OlyChat",
  description: "Open-Source AI Platform for Modern Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <Head>
        <link rel="icon" href="/favicon.ico" />
    
      </Head>
      <body className={inter.className}>
        
        {children}
        
        <Toaster />
        </body>
    </html>
  );
}
