import { PATHS } from "@/configs/paths/pages.paths";

const groups = [
  {
    title: "API и SDK",
    items: [
      [PATHS.DOCS.CONNECTION, "Быстрый старт"],
      [PATHS.DOCS.MODELS, "Модели и ID"],
      [PATHS.DOCS.CHAT, "Chat Completions"],
      [PATHS.DOCS.STREAM, "Streaming"],
      [PATHS.DOCS.SDK, "Python и JavaScript"],
      [PATHS.DOCS.LIMITS, "Лимиты и баланс"],
      [PATHS.DOCS.ERRORS, "Ошибки"],
    ],
  },
  {
    title: "Настройка агентов",
    items: [
      [PATHS.DOCS.CLAUDE_CODE, "Claude Code"],
      [PATHS.DOCS.CODEX, "Codex"],
      [PATHS.DOCS.CURSOR, "Cursor"],
      [PATHS.DOCS.HERMES, "Hermes"],
      [PATHS.DOCS.KIMI_CODE, "Kimi Code"],
      [PATHS.DOCS.OPENCODE, "OpenCode"],
      [PATHS.DOCS.VSCODE, "VS Code / Cline"],
      [PATHS.DOCS.TROUBLESHOOTING, "Если не подключается"],
    ],
  },
] as const;

export function DocsNavigation() {
  return (
    <aside className="h-fit rounded-[18px] bg-[#1b1b1b] p-4 lg:sticky lg:top-16 lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto">
      <nav
        aria-label="Разделы документации"
        className="space-y-4"
      >
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="px-2 text-xs font-medium uppercase tracking-wider text-[#a5a5a1]">{group.title}</h2>
            <ul className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
              {group.items.map(([href, label]) => (
                <li
                  key={href}
                  className="min-w-0"
                >
                  <a
                    href={href}
                    className="flex min-h-11 items-center rounded-lg px-2.5 py-2 text-[13px] text-[#c5c5c0] transition-colors hover:bg-[#242424] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
