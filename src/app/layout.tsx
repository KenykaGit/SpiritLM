import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SpiritLM",
  },
  description: "Подключайте ведущие языковые модели через единый API SpiritLM.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
