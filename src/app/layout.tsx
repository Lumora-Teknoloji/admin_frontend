import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/SidebarProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LUMORA Admin",
  description: "Analysis Engine Control Panel",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin'}/favicon.ico`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
