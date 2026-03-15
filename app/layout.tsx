import type { Metadata } from "next";
import { Delius, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CategoryList, ColorList, StyleList } from "@/app/store/storeData";
import AppChrome from "@/components/AppChrome";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const delius = Delius({
  variable: "--font-delius",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "TemplatesDesk",
  description: "Free canva templates for your design projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className={`${delius.variable} antialiased`}>
        <AppChrome
          categories={CategoryList}
          colors={ColorList}
          styles={StyleList}
        >
          {children}
        </AppChrome>
      </body>
    </html>
  );
}
