import type { Metadata } from "next";
import Link from "next/link";
import { IconSettings } from "@tabler/icons-react";
import {
  ALL_MODEL_IDS,
  DOCS_CODE,
  DOCS_INTEGRATIONS,
  OPENCODE_CONFIG,
} from "@/configs/consts/docs.const";
import { PATHS } from "@/configs/paths/pages.paths";
import { CodeBlock } from "./_components/code-block";
import { GuideSection } from "./_components/guide-section";

export const metadata: Metadata = {
  title: "Документация",
};

export default function DashboardDocsPage() {
  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="dashboard-page-title">
      <div className="mx-auto max-w-[1340px]">
        <header className="mb-6 rounded-[20px] bg-[#1b1b1b] p-5 sm:p-7">
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 id="dashboard-page-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Документация
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a5a5a1] sm:text-base">
                Добавьте SpiritLM как провайдера, затем выберите ID модели в настройках инструмента.
                Примеры ниже используют значения из каталога и API-ключ вашего аккаунта.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={PATHS.DASHBOARD.KEYS}
                className="inline-flex h-10 items-center rounded-xl bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
              >
                API-ключи
              </Link>
              <Link
                href={PATHS.DASHBOARD.MODELS}
                className="inline-flex h-10 items-center rounded-xl bg-white/[0.07] px-4 text-sm font-medium text-[#f3f2ee] transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
              >
                Каталог моделей
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[18px] bg-[#1b1b1b] p-4 lg:sticky lg:top-16" aria-label="На этой странице">
            <h2 className="px-2 text-xs font-medium text-[#858580]">НАСТРОЙКА</h2>
            <nav className="mt-2 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Разделы руководства">
              {DOCS_INTEGRATIONS.map((item) => (
                <a
                  key={item.id}
                  href={"#" + item.id}
                  className="flex h-9 shrink-0 items-center rounded-lg px-2.5 text-[13px] text-[#c5c5c0] transition-colors hover:bg-[#242424] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-4">
            <GuideSection
              id="before-start"
              title="Перед началом"
              description="Для каждого инструмента нужны ключ, API-адрес и точный идентификатор модели."
            >
              <ol className="list-decimal space-y-2 pl-5 marker:text-[#ffe02e]">
                <li>Создайте API-ключ в разделе <Link className="text-[#ffe02e] hover:underline" href={PATHS.DASHBOARD.KEYS}>API-ключи</Link>. Не сохраняйте секрет в проекте или Git.</li>
                <li>Скопируйте полный ID модели в <Link className="text-[#ffe02e] hover:underline" href={PATHS.DASHBOARD.MODELS}>каталоге моделей</Link>, например <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-xs text-[#f3f2ee]">anthropic/claude-sonnet-4.6</code> или <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-xs text-[#f3f2ee]">openai/gpt-6.1-sol</code>.</li>
                <li>Возьмите API URL из настроек подключения SpiritLM. URL-адрес в примерах заменён на переменную — используйте выданный вам адрес.</li>
              </ol>
              <div className="mt-5 rounded-xl bg-[#242424] p-4">
                <h3 className="font-medium text-[#f3f2ee]">Учитывайте формат API</h3>
                <p className="mt-1 text-[#a5a5a1]">
                  Claude Code требует endpoint Anthropic Messages API, Codex — OpenAI Responses API.
                  Настройки Cursor, Hermes, Kimi Code, OpenCode и Cline ниже используют OpenAI Chat Completions.
                  Если ваш SpiritLM endpoint не поддерживает нужный протокол, одной замены адреса недостаточно.
                </p>
              </div>
            </GuideSection>

            <GuideSection
              id="model-ids"
              title="ID всех моделей"
              description="Список берётся из каталога SpiritLM, поэтому обновляется вместе с доступными моделями."
            >
              <CodeBlock title="Model IDs" value={ALL_MODEL_IDS} />
            </GuideSection>

            <GuideSection id="claude-code" title="Claude Code" description="Задайте provider в пользовательском конфиге и добавьте все модели SpiritLM в переключатель /model.">
              <p>Откройте <code className="text-xs text-[#f3f2ee]">~/.claude/settings.json</code> (Windows: <code className="text-xs text-[#f3f2ee]">%USERPROFILE%\\.claude\\settings.json</code>) и добавьте этот блок. Массив <code className="text-xs text-[#f3f2ee]">modelPicker.options</code> формируется по всему каталогу SpiritLM:</p>
              <CodeBlock title="~/.claude/settings.json" value={DOCS_CODE.claudeSettings} />
              <p className="mt-4">После запуска Claude Code введите <code className="text-xs text-[#f3f2ee]">/model</code> и выберите модель. Поле <code className="text-xs text-[#f3f2ee]">model</code> задаёт начальную модель; список переключателя не ограничен ею. Выбор можно менять из сессии.</p>
              <p className="mt-3 text-[#a5a5a1]">URL должен вести на Anthropic Messages API. Перед запуском проверьте, что выбранные ID доступны через этот endpoint. Ключ в файле хранится открытым текстом; ограничьте доступ к файлу и не добавляйте его в репозиторий. Формат настроек — в <a className="text-[#ffe02e] hover:underline" href="https://code.claude.com/docs/en/settings" target="_blank" rel="noreferrer">справке settings.json</a>, параметры моделей — в <a className="text-[#ffe02e] hover:underline" href="https://code.claude.com/docs/en/model-config" target="_blank" rel="noreferrer">справке Claude Code</a>.</p>
            </GuideSection>

            <GuideSection id="codex" title="Codex" description="Задайте SpiritLM один раз и создайте отдельный профиль Codex для каждой модели.">
              <p>Добавьте provider в <code className="text-xs text-[#f3f2ee]">~/.codex/config.toml</code>. На Windows файл находится в <code className="text-xs text-[#f3f2ee]">%USERPROFILE%\\.codex\\config.toml</code>.</p>
              <CodeBlock title="~/.codex/config.toml" value={DOCS_CODE.codex} />
              <CodeBlock title="macOS / Linux · запуск" value={['export SPIRITLM_API_KEY="<SPIRITLM_API_KEY>"', "codex"].join("\n")} />
              <p className="mt-4">Для сохранения нескольких моделей создайте отдельный профиль для каждой в <code className="text-xs text-[#f3f2ee]">~/.codex/&lt;имя&gt;.config.toml</code>. Код ниже содержит profile-файлы для каждого ID в каталоге. Запустите нужный так: <code className="text-xs text-[#f3f2ee]">codex --profile spiritlm-openai-gpt-6-1-sol</code> (имя профиля — из имени файла без расширения).</p>
              <CodeBlock title="~/.codex/spiritlm-*.config.toml · профили для всего каталога" value={DOCS_CODE.codexProfiles} />
              <p className="mt-3 text-[#a5a5a1]">Codex CLI и расширение VS Code читают общие настройки. Для смены профиля в CLI используйте <code className="text-xs text-[#f3f2ee]">codex --profile &lt;имя&gt;</code>; в конфиге расширения укажите <code className="text-xs text-[#f3f2ee]">profile = &quot;&lt;имя&gt;&quot;</code>. Codex использует Responses API и сам добавляет путь <code className="text-xs text-[#f3f2ee]">/responses</code> к базовому URL. Не включайте его в <code className="text-xs text-[#f3f2ee]">base_url</code>. Подробнее о профилях — в <a className="text-[#ffe02e] hover:underline" href="https://developers.openai.com/codex/config-basic" target="_blank" rel="noreferrer">документации Codex</a>.</p>
            </GuideSection>

            <GuideSection id="cursor" title="Cursor" description="Добавьте SpiritLM через настройки моделей Cursor как пользовательский OpenAI endpoint.">
              <ol className="list-decimal space-y-2 pl-5 marker:text-[#ffe02e]">
                <li>Откройте Settings {"->"} Models.</li>
                <li>В настройке OpenAI API вставьте ключ SpiritLM и включите пользовательский Base URL.</li>
                <li>Добавьте модель, её точный ID и OpenAI-совместимый URL SpiritLM.</li>
                <li>Сохраните настройку и выберите модель в Chat или Agent.</li>
              </ol>
              <CodeBlock title="Пример значений" value={DOCS_CODE.cursor} />
            </GuideSection>

            <GuideSection id="hermes" title="Hermes" description="Настройте custom endpoint через интерактивную команду или конфигурационный файл.">
              <p>Запустите <code className="text-xs text-[#f3f2ee]">hermes model</code>, выберите пользовательский endpoint и укажите URL, API-ключ и ID модели. Для ручной настройки добавьте блок в <code className="text-xs text-[#f3f2ee]">~/.hermes/config.yaml</code>:</p>
              <CodeBlock title="~/.hermes/config.yaml" value={DOCS_CODE.hermes} />
            </GuideSection>

            <GuideSection id="kimi-code" title="Kimi Code" description="Опишите OpenAI-совместимый provider и одну или несколько моделей в config.toml.">
              <p>Добавьте конфигурацию в <code className="text-xs text-[#f3f2ee]">~/.kimi/config.toml</code>. Замените URL, ключ и model ID; значение контекста укажите по спецификации модели.</p>
              <CodeBlock title="~/.kimi/config.toml" value={DOCS_CODE.kimi} />
            </GuideSection>

            <GuideSection id="opencode" title="OpenCode" description="Добавьте custom provider в opencode.json и сохраните ключ в переменной окружения.">
              <p>Создайте или обновите <code className="text-xs text-[#f3f2ee]">opencode.json</code> в проекте:</p>
              <CodeBlock title="opencode.json · весь каталог моделей" value={OPENCODE_CONFIG} />
              <CodeBlock title="macOS / Linux · запуск" value={['export SPIRITLM_API_KEY="<SPIRITLM_API_KEY>"', "opencode"].join("\n")} />
              <p className="mt-3 text-[#a5a5a1]">В OpenCode выберите добавленную модель через команду <code className="text-xs text-[#f3f2ee]">/models</code>.</p>
            </GuideSection>

            <GuideSection id="vscode" title="VS Code" description="Подключите Claude Code или Codex через их общие конфиги, либо используйте Cline как самостоятельное расширение.">
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-[#f3f2ee]">Claude Code</h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 marker:text-[#ffe02e]">
                    <li>Установите расширение Claude Code из Marketplace и откройте его панель. Оно использует CLI-конфигурацию из <code className="text-xs text-[#f3f2ee]">~/.claude/settings.json</code>.</li>
                    <li>Добавьте provider и полный список моделей по примеру выше, затем войдите в расширение.</li>
                    <li>В панели расширения выполните <code className="text-xs text-[#f3f2ee]">/model</code> и выберите модель из настроенного списка.</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-[#f3f2ee]">Codex</h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 marker:text-[#ffe02e]">
                    <li>Установите Codex из Marketplace VS Code и откройте панель расширения.</li>
                    <li>
                      Расширение и CLI используют общий <code className="text-xs text-[#f3f2ee]">~/.codex/config.toml</code>.
                      Откройте файл из расширения: <IconSettings aria-hidden="true" className="mx-1 inline-block align-[-3px]" size={15} stroke={1.7} />
                      Codex Settings {"->"} Open config.toml.
                    </li>
                    <li>Задайте <code className="text-xs text-[#f3f2ee]">SPIRITLM_API_KEY</code> и выберите профиль, указав <code className="text-xs text-[#f3f2ee]">profile = &quot;spiritlm-openai-gpt-6-1-sol&quot;</code> в <code className="text-xs text-[#f3f2ee]">config.toml</code>. Используйте имя другого профиля, чтобы переключиться на соответствующую модель.</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-[#f3f2ee]">Cline</h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 marker:text-[#ffe02e]">
                    <li>
                      Установите Cline из Marketplace и откройте настройки через значок
                      <IconSettings aria-hidden="true" className="mx-1 inline-block align-[-3px]" size={15} stroke={1.7} />.
                    </li>
                    <li>В поле API Provider выберите <code className="text-xs text-[#f3f2ee]">OpenAI Compatible</code>; укажите Chat Completions Base URL и API-ключ SpiritLM.</li>
                    <li>В Model выберите модель из списка провайдера или введите полный ID. Нажмите Verify. Чтобы сменить модель, выберите или введите другой ID в этом поле.</li>
                  </ol>
                  <p className="mt-3">Здесь перечислены все текущие ID моделей SpiritLM для Cline. Если список не загрузился в расширении, скопируйте нужный ID вручную:</p>
                  <CodeBlock title="Cline · все ID моделей SpiritLM" value={DOCS_CODE.clineModels} />
                  <p className="mt-3 text-[#a5a5a1]">Укажите context window, лимит вывода и поддержку изображений в Model Configuration по спецификации модели. Cline и SpiritLM должны использовать OpenAI Chat Completions API. См. <a className="text-[#ffe02e] hover:underline" href="https://docs.cline.bot/provider-config/openai-compatible" target="_blank" rel="noreferrer">инструкцию Cline для OpenAI Compatible</a>.</p>
                </div>
              </div>
            </GuideSection>

            <section className="rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6" aria-labelledby="troubleshooting-title">
              <h2 id="troubleshooting-title" className="text-lg font-semibold tracking-tight text-[#f3f2ee] sm:text-xl">
                Если не подключается
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#a5a5a1] marker:text-[#ffe02e]">
                <li>Проверьте ключ, базовый URL и поддерживаемый им формат API.</li>
                <li>Скопируйте точный ID модели из каталога; отображаемое имя может отличаться.</li>
                <li>Убедитесь, что выбранная модель доступна для вашего ключа и аккаунта.</li>
                <li>Проверьте соответствие протокола: Responses API для Codex, Anthropic Messages API для Claude Code.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
