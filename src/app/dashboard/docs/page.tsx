import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { docsCode } from "@/configs/consts/docs.const";
import { API_URL } from "@/configs/consts/api.const";
import { PATHS } from "@/configs/paths/pages.paths";
import { CodeBlock } from "./_components/code-block";
import { GuideSection } from "./_components/guide-section";

export const metadata: Metadata = { title: "Документация" };

export default async function DashboardDocsPage() {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") === "http" ? "http" : "https";
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const baseUrl = API_URL ?? `${protocol}://${host}/v1`;
  const code = docsCode(baseUrl);
  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="dashboard-page-title">
      <div className="mx-auto max-w-[1340px] space-y-4">
        <header className="rounded-[20px] bg-[#1b1b1b] p-5 sm:p-7">
          <h1 id="dashboard-page-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Документация</h1>
          <p className="mt-3 text-sm leading-6 text-[#a5a5a1]">SpiritLM предоставляет API в формате OpenAI Chat Completions.</p>
          <p className="mt-3 rounded-xl bg-[#ffe02e]/10 p-4 text-sm leading-6 text-[#ffe02e]">
            Тарифы в каталоге окончательные. Перед генерацией резервируется часть
            баланса, после ответа списывается стоимость по usage, а остаток резерва
            возвращается.
          </p>
          <Link href={PATHS.DASHBOARD.KEYS} className="mt-4 inline-flex rounded-xl bg-[#ffe02e] px-4 py-2 text-sm font-semibold text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]">API-ключи</Link>
        </header>
        <GuideSection id="connection" title="Подключение" description="Используйте собственный ключ SpiritLM. Секрет показывается один раз при создании.">
          <CodeBlock title="Base URL" value={baseUrl} />
          <p className="mt-3">В SDK, совместимом с OpenAI, задайте этот адрес как base_url, а ключ SpiritLM — как api_key. Храните ключ в переменных окружения.</p>
        </GuideSection>
        <GuideSection id="models" title="Доступные модели" description="GET /v1/models возвращает модели, доступность которых подтверждена поставщиком. Для запроса нужен Bearer-ключ SpiritLM.">
          <CodeBlock title="Список моделей" value={code.models} />
          <p className="mt-3">Используйте ID из ответа API. Цены в <Link href={PATHS.DASHBOARD.MODELS} className="text-[#ffe02e] hover:underline">каталоге</Link> — окончательные тарифы в рублях за 1 млн токенов.</p>
        </GuideSection>
        <GuideSection id="chat" title="Chat Completions" description="POST /v1/chat/completions принимает model, messages и параметры генерации.">
          <CodeBlock title="Обычный запрос" value={code.chat} />
          <p className="mt-3">Максимальный размер тела — 1 МиБ, количество сообщений — 256. Лимит вывода задаётся положительным целым числом через max_tokens или max_completion_tokens. Верхняя граница зависит от модели и возвращается в /v1/models как max_output_tokens, если поставщик её объявляет. Если лимит неизвестен, укажите max_tokens для расчёта резерва. Поддерживается один вариант ответа: n = 1.</p>
        </GuideSection>
        <GuideSection id="stream" title="Потоковый ответ" description="При stream: true ответ передаётся через Server-Sent Events и завершается событием data: [DONE].">
          <CodeBlock title="Тело потокового запроса" value={code.stream} />
          <p className="mt-3">Итоговый usage содержит prompt_tokens, completion_tokens и total_tokens. Кэшированные и reasoning токены сохраняются отдельно, когда поставщик их возвращает; они не прибавляются повторно к общему расходу.</p>
          <p className="mt-3">При обрыве потока usage может остаться неизвестным. В этом случае удерживается резерв запроса, пока расход не удастся определить; он не считается нулевым.</p>
        </GuideSection>
        <GuideSection id="protocols" title="Другие протоколы" description="Responses API, Anthropic Messages и подсчёт токенов отдельным endpoint пока не подключены.">
          <p>Интеграции, требующие этих протоколов, включая Codex и Claude Code, пока недоступны. Для запросов используйте протокол Chat Completions.</p>
        </GuideSection>
        <GuideSection id="errors" title="Ошибки" description="Ответы об ошибках содержат объект error с полями message, type и code.">
          <p>401 — неверный или отозванный ключ; 402 — недостаточно средств; 400 — некорректные параметры; 413 — слишком большой запрос; 429 — превышение лимитов; 502/504 — ошибка или таймаут модели.</p>
          <p className="mt-3">Не повторяйте автоматически генерацию после обрыва: поставщик мог уже обработать запрос. В истории сохраняется ID запроса для диагностики.</p>
        </GuideSection>
      </div>
    </main>
  );
}
