import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { getThemePreference } from "@/shared/lib/preferences.lib";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  icons: {
    icon: '/logo.svg'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemePreference()

  return (
    <html lang="es" data-theme={theme}>
      <body
        className={`${GeistSans.className} antialiased bg-gray-100 text-gray-950 dark:text-gray-100 dark:bg-gray-950 transition-colors`}
      >
        {children}
      </body>
    </html>
  );
}
