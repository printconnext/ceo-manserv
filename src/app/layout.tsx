import type { Metadata } from "next";
import { Outfit, Prompt, Sarabun } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const prompt = Prompt({
  weight: ['400', '500', '600', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
});

const sarabun = Sarabun({
  weight: ['400', '500', '600', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "CEO Profile | Visionary Leadership",
  description: "Personal portfolio and professional background of a forward-thinking CEO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${prompt.variable} ${sarabun.variable} antialiased font-sans bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
