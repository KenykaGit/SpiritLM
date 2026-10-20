import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SpiritLM",
  },
  description: "Подключайте ведущие языковые модели через единый API SpiritLM.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-spirit-canvas font-body text-spirit-text antialiased selection:bg-spirit-accent selection:text-spirit-accent-ink">
        <ClerkProvider signInUrl="/auth/sign-in" signUpUrl="/auth/sign-up">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
