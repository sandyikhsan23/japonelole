import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Japonelole",
  description: "Belajar kosakata bahasa Jepang lewat visual ruangan interaktif.",
  appleWebApp: {
    title: "Japonelole",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2340",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`h-full antialiased ${poppins.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-navy font-sans">{children}</body>
    </html>
  );
}
