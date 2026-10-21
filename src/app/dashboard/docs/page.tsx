import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { docsCode } from "@/configs/consts/docs.const";
import { API_URL } from "@/configs/consts/api.const";
import { LINKS } from "@/configs/paths/links.paths";
import { PATHS } from "@/configs/paths/pages.paths";
import {
  ChatGuide,
  ConnectionGuide,
  ErrorsGuide,
  LimitsGuide,
  ModelsGuide,
  StreamGuide,
} from "./_components/api-reference";
import {
  ClaudeCodeGuide,
  CodexGuide,
  CursorGuide,
  HermesGuide,
  KimiGuide,
  OpenCodeGuide,
  TroubleshootingGuide,
  VsCodeGuide,
} from "./_components/agent-guides";
import { DocsNavigation } from "./_components/docs-navigation";
import { SdkGuides } from "./_components/sdk-guides";

export const metadata: Metadata = {
  title: "Документация",
};

export default async function DashboardDocsPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const protocol = forwardedProtocol === "http" || (!forwardedProtocol && localHost)
    ? "http"
    : "https";
  const baseUrl = (API_URL ?? `${protocol}://${host}/v1`).replace(/\/+$/, "");
  const code = docsCode(baseUrl);

  return (
    <main
      className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
      aria-labelledby="dashboard-page-title"
    >
      <div className="mx-auto max-w-[1340px]">
        <header className="mb-6 rounded-[20px] bg-[#1b1b1b] p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <h1
                id="dashboard-page-title"
                className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
              >Документация</h1>
              <p className="mt-3 text-sm leading-6 text-[#a5a5a1] sm:text-base">Подключите SpiritLM к своему приложению или агенту: эндпоинты, примеры запросов, SDK и настройки инструментов.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={PATHS.DASHBOARD.KEYS}
                className="inline-flex min-h-11 items-center rounded-xl bg-[#ffe02e] px-4 py-2 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#f1d326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
              >API-ключи</Link>
              <Link
                href={PATHS.DASHBOARD.MODELS}
                className="inline-flex min-h-11 items-center rounded-xl bg-white/[0.07] px-4 py-2 text-sm font-medium text-[#f3f2ee] transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
              >Каталог моделей</Link>
              <a
                href={LINKS.TELEGRAM_SUPPORT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-xl bg-white/[0.07] px-4 py-2 text-sm font-medium text-[#f3f2ee] transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
              >Поддержка в Telegram</a>
            </div>
          </div>
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <DocsNavigation />
          <div className="min-w-0 space-y-4">
            <ConnectionGuide
              baseUrl={baseUrl}
              code={code}
            />
            <ModelsGuide code={code} />
            <ChatGuide code={code} />
            <StreamGuide code={code} />
            <SdkGuides code={code} />
            <LimitsGuide />
            <ErrorsGuide code={code} />
            <ClaudeCodeGuide code={code} />
            <CodexGuide code={code} />
            <CursorGuide code={code} />
            <HermesGuide code={code} />
            <KimiGuide code={code} />
            <OpenCodeGuide code={code} />
            <VsCodeGuide code={code} />
            <TroubleshootingGuide />
          </div>
        </div>
      </div>
    </main>
  );
}
