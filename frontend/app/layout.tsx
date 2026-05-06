import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { CompareProvider } from "@/components/compare-provider";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Decision Platform",
  description: "Decision-first college discovery and comparison experience"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions can inject attributes on <html> during local dev; suppress the false mismatch noise.
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CompareProvider>
            <Header />
            <main className="mx-auto min-h-[calc(100vh-80px)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
