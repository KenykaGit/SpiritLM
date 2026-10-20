import type { DashboardSummary } from "@/configs/types/api.types";

export function UsageDetails({ summary }: { summary: DashboardSummary | null }) {
  return (
    <div className="my-6 grid gap-4 lg:grid-cols-2">
      <section className="rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6" aria-labelledby="token-details-title">
        <h2 id="token-details-title" className="text-base font-semibold">Токены за 48 часов</h2>
        <dl className="mt-5 grid grid-cols-2 gap-5">
          {[
            { label: "Входящие", value: summary?.inputTokens },
            { label: "Исходящие", value: summary?.outputTokens },
            { label: "Из кэша", value: summary?.cachedTokens },
            { label: "Reasoning", value: summary?.reasoningTokens },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-[#999994]">{item.label}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{item.value?.toLocaleString("ru-RU") ?? "—"}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-5 text-[#858580]">Кэш и reasoning — детализация расхода; они не прибавляются повторно к общему числу токенов.</p>
        <h3 className="mt-6 text-sm font-medium">По моделям</h3>
        {!summary?.models.length ? (
          <p className="mt-3 text-sm text-[#858580]">{summary ? "Пока нет запросов" : "Загружаем…"}</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/[0.06]">
            {summary.models.map((item) => (
              <li key={item.model} className="flex items-start justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="break-words font-mono text-xs text-[#d0d0cb]">{item.model}</p>
                  <p className="mt-1 text-xs text-[#858580]">Запросов: {item.requests.toLocaleString("ru-RU")}</p>
                </div>
                <span className="shrink-0 tabular-nums">{item.tokens.toLocaleString("ru-RU")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6" aria-labelledby="credits-title">
        <h2 id="credits-title" className="text-base font-semibold">История начислений</h2>
        <p className="mt-1 text-xs text-[#858580]">Последние 20 операций</p>
        {!summary?.credits.length ? (
          <p className="mt-6 text-sm text-[#858580]">{summary ? "Начислений пока нет" : "Загружаем…"}</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {summary.credits.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="break-words text-sm text-[#d0d0cb]">{item.note}</p>
                  <p className="mt-1 text-xs text-[#858580]">{new Date(item.createdAt).toLocaleString("ru-RU")}</p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-[#ffe02e]">+₽ {Number(item.amount).toLocaleString("ru-RU", { maximumFractionDigits: 4 })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
