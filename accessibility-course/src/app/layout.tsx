import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "./components/navwrapper";

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
        <NavbarWrapper>
            {children}
        </NavbarWrapper>
      </body>
    </html>
  );
}
