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

// Create client component to avoid server component issues with SessionProvider
import { SessionProvider } from "./components/session-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={lexend.style}>
        <SessionProvider>
          <NavbarWrapper>
              {children}
          </NavbarWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
