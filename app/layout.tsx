import type { Metadata } from "next";
import { Agdasima } from "next/font/google";
import "./globals.css";

const agdasima = Agdasima({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-agdasima",
});

export const metadata: Metadata = {
  title: "Memory Game"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${agdasima.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
