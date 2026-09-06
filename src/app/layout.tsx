import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Cinefolio | Your film history",
  description: "A personal archive of films worth remembering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><ToastProvider />{children}</body>
    </html>
  );
}
