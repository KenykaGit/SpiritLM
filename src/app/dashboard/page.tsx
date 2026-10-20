"use client";

import { useUser } from "@clerk/nextjs";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TopUpModal } from "@/components/modals/top-up-modal";
import type { DashboardSummary } from "@/configs/types/api.types";
import { dashboardFetch } from "@/lib/dashboard-client";
import { UsageDetails } from "./_components/usage-details";

const chartConfig = {
  tokens: {
    label: "Токены",
    color: "#ffe02e",
  },
} satisfies ChartConfig;
export default function Dashboard() {
  const { user } = useUser();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const data = await dashboardFetch<DashboardSummary>("/api/dashboard/summary", { signal: controller.signal });
        setSummary(data);
        setError(null);
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Не удалось загрузить статистику");
      }
    }
    void load();
    const interval = window.setInterval(() => { void load(); }, 60_000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, []);
  const usageData = summary?.usage ?? [];
  const requests = summary?.requests ?? [];
  const average = summary?.requestCount ? Math.round(summary.tokens / summary.requestCount) : 0;
  const username = user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Пользователь";

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="dashboard-page-title">
      <div className="mx-auto max-w-[1340px]">
        {error && <p role="alert" className="mb-4 rounded-xl bg-[#1b1b1b] p-4 text-sm text-[#ffb3a9]">{error}</p>}
        <section className="mb-6 rounded-[20px] border border-white/[0.04] bg-[#1b1b1b] p-5 sm:p-6" aria-label="Сводка аккаунта">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm text-[#999994]">Главная</p>
              <h1 id="dashboard-page-title" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{username}</h1>
            </div>
            <button
              type="button"
              onClick={() => setTopUpOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
            >
              <IconPlus aria-hidden="true" size={16} stroke={1.7} />
              Пополнить
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric label="Баланс" value={summary ? rubles(summary.balance) : "—"} detail="Начисляется вручную" />
            <Metric label="Потрачено за всё время" value={summary ? rubles(summary.spent) : "—"} detail="Фактические списания" />
            <Metric label="Токенов за 48 часов" value={summary ? summary.tokens.toLocaleString("ru-RU") : "—"} detail={summary?.unknownUsageCount ? `Запросов без данных о расходе: ${summary.unknownUsageCount}` : "По данным ответов API"} />
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]" aria-label="Использование токенов">
          <article className="rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Расход токенов</h2>
                <p className="mt-1 text-xs text-[#858580]">Почасовой расход · UTC</p>
              </div>
              <span className="rounded-full bg-[#ffe02e]/10 px-3 py-1.5 text-xs font-medium text-[#ffe02e]">{summary ? summary.tokens.toLocaleString("ru-RU") : "—"} токенов</span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="mt-5 h-48 w-full aspect-auto"
              aria-label="Расход токенов за последние 48 часов"
            >
              <AreaChart accessibilityLayer data={usageData} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-tokens)" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="var(--color-tokens)" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.08} strokeDasharray="3 4" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={9}
                  interval={5}
                  tick={{ fill: "#777875", fontSize: 10 }}
                  tickFormatter={(value: string) => new Date(value).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
                />
                <ChartTooltip
                  cursor={{ stroke: "#777875", strokeDasharray: "4 4" }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="tokens"
                  type="monotone"
                  stroke="var(--color-tokens)"
                  strokeWidth={2}
                  fill="url(#fillTokens)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#ffe02e", stroke: "#1b1b1b", strokeWidth: 2 }}
                />
              </AreaChart>
            </ChartContainer>
          </article>
          <article className="flex flex-col rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6">
            <h2 className="text-base font-semibold">За 48 часов</h2>
            <p className="mt-1 text-xs text-[#858580]">Последние 48 часов · UTC</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Запросы</span><span className="text-2xl font-semibold">{summary ? summary.requestCount.toLocaleString("ru-RU") : "—"}</span></div>
              <div className="h-px bg-white/[0.07]" />
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Средний расход</span><span className="text-xl font-semibold sm:text-2xl">{summary ? average.toLocaleString("ru-RU") : "—"} <span className="text-xs font-normal text-[#858580] sm:text-sm">токена / запрос</span></span></div>
              <div className="h-px bg-white/[0.07]" />
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Расход средств</span><span className="text-2xl font-semibold">{summary ? rubles(summary.cost48h) : "—"}</span></div>
            </div>
          </article>
        </section>

        <UsageDetails summary={summary} />
        <section className="overflow-hidden rounded-[18px] bg-[#1b1b1b]" aria-labelledby="requests-title">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 id="requests-title" className="text-base font-semibold">Последние запросы</h2>
              <p className="mt-1 text-xs text-[#858580]">Последние 20 запросов</p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[#a5a5a1]">История запросов</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.025] text-[11px] font-medium uppercase tracking-wide text-[#777875]">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Модель</th>
                  <th className="px-4 py-3">ID запроса</th>
                  <th className="px-4 py-3">Время</th>
                  <th className="px-4 py-3 text-right">Токены</th>
                  <th className="px-4 py-3 text-right">Списано</th>
                  <th className="px-5 py-3 text-right sm:px-6">Статус</th>
                </tr>
              </thead>
              <tbody>
                {!requests.length && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#858580]">
                      {summary ? "Пока нет запросов" : error ? "Статистика недоступна" : "Загружаем статистику…"}
                    </td>
                  </tr>
                )}
                {requests.map((request) => (
                  <tr key={request.id} className="border-t border-white/[0.06]">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[#f3f2ee] sm:px-6">
                      {request.model}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-[#858580]">
                      {request.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#a5a5a1]">
                      {new Date(request.createdAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums">
                      {request.totalTokens === null ? "Нет данных" : request.totalTokens.toLocaleString("ru-RU")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums">
                      {rubles(request.chargedCost)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${request.status === "SUCCEEDED" ? "text-[#9fc7a1]" : "text-[#c5c5c0]"}`}>
                        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                        {statusLabel(request.status)}{request.diagnostic ? " · Тест" : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <TopUpModal
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
      />
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[14px] bg-[#242424] px-4 py-4">
      <p className="text-xs text-[#999994]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] text-[#777875]">{detail}</p>
    </div>
  );
}

function rubles(value: string) {
  return `₽ ${Number(value).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    SUCCEEDED: "Успешно",
    FAILED: "Ошибка",
    INTERRUPTED: "Прерван",
    RUNNING: "Выполняется",
  };
  return labels[status] ?? "Неизвестно";
}
