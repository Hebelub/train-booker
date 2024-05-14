import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientSideAuthHandler from "@/components/ClientSideAuthHandler";
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workout Booker",
  description: "Book your next group workout session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ClientSideAuthHandler />
      <html lang="en">
        <body className={inter.className}>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

            <Header />

            {children}

            <Toaster />
          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
