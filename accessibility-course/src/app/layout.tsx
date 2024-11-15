import type { Metadata } from "next";
import "./globals.css";

//👇 Import Lexend
import { Lexend } from 'next/font/google';

const lexend = Lexend({
    subsets: ['latin'], 
    variable: '--font-lexend',
  });

export const metadata: Metadata = {
  title: "Accessibility Course",
  description: "Accessibility course created using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={lexend.style}>
        {children}
      </body>
    </html>
  );
}
