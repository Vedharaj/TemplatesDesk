"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type AppChromeProps = {
  children: ReactNode;
  categories: string[];
  colors: string[];
  styles: string[];
};

export default function AppChrome({
  children,
  categories,
  colors,
  styles,
}: AppChromeProps) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/boss") ?? false;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar data={{ categories, colors, styles }} />
      {children}
      <Footer />
    </>
  );
}
