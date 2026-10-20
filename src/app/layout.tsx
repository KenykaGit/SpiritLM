import { ClerkProvider } from "@clerk/nextjs";
import { ruRU } from "@clerk/localizations";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SpiritLM",
    template: "%s | SpiritLM",
  },
  description: "Подключайте ведущие языковые модели через единый API SpiritLM.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-spirit-canvas font-body text-spirit-text antialiased selection:bg-spirit-accent selection:text-spirit-accent-ink">
        <ClerkProvider
          localization={{
            ...ruRU,
            socialButtonsBlockButton: "{{provider}}",
            socialButtonsBlockButtonManyInView: "{{provider}}",
          }}
          signInUrl="/auth/sign-in"
          signUpUrl="/auth/sign-up"
          appearance={{
            variables: {
              colorPrimary: "#ffffff",
              colorBackground: "#202020",
              colorForeground: "#f3f2ee",
              colorPrimaryForeground: "#202020",
              colorMutedForeground: "#a5a5a1",
              colorMuted: "#383838",
              colorInput: "#383838",
              colorInputForeground: "#f3f2ee",
              colorNeutral: "#a5a5a1",
              colorBorder: "#424242",
              colorRing: "#f3f2ee",
              colorDanger: "#ff7777",
              borderRadius: "12px",
              fontFamily: "Figtree, Arial, sans-serif",
            },
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
