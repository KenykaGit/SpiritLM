"use client";

import { useUser } from "@clerk/nextjs";
import { IconPlus } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TopUpModal } from "@/components/modals/top-up-modal";

const usage = [18, 24, 20, 34, 28, 42, 37, 53, 47, 58, 46, 65, 57, 72, 63, 78, 69, 84, 76, 92, 81, 96, 87, 100];
const usageTotal = 128_450;
const usageWeightTotal = usage.reduce((total, value) => total + value, 0);
const usageData = usage.map((weight, index) => ({
  time: `${Math.round(48 - index * 48 / (usage.length - 1))} ч. назад`,
  tokens: Math.round(weight / usageWeightTotal * usageTotal),
}));
usageData[usageData.length - 1].tokens += usageTotal - usageData.reduce((total, point) => total + point.tokens, 0);
const chartConfig = {
  tokens: {
    label: "Токены",
    color: "#ffe02e",
  },
} satisfies ChartConfig;
const requests = [
  { model: "GPT-4o", id: "req_8f2a…c91d", time: "Сегодня, 14:32", tokens: "2 840", cost: "₽ 0,43", status: "Успешно" },
  { model: "Claude 3.7 Sonnet", id: "req_2c71…a04b", time: "Сегодня, 14:18", tokens: "5 216", cost: "₽ 1,04", status: "Успешно" },
  { model: "Gemini 2.5 Pro", id: "req_9d31…ef62", time: "Сегодня, 13:56", tokens: "1 905", cost: "₽ 0,38", status: "Успешно" },
  { model: "DeepSeek V3", id: "req_4a8c…bb17", time: "Сегодня, 13:41", tokens: "3 472", cost: "₽ 0,17", status: "Успешно" },
  { model: "GPT-4o", id: "req_761e…2f08", time: "Сегодня, 12:59", tokens: "8 104", cost: "₽ 1,22", status: "Успешно" },
];

export default function Dashboard() {
  const { user } = useUser();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const username = user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Пользователь";

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="dashboard-page-title">
      <div className="mx-auto max-w-[1340px]">
        <section className="mb-6 rounded-[20px] border border-white/[0.04] bg-[#1b1b1b] p-5 sm:p-6" aria-label="Сводка аккаунта">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm text-[#999994]">Главная</p>
              <h1 id="dashboard-page-title" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{username}</h1>
            </div>
            <button
              type="button"
              onClick={() => setTopUpOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#f1d326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
            >
              <IconPlus aria-hidden="true" size={16} stroke={1.7} />
              Пополнить
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric label="Баланс" value="₽ 1 250,00" detail="Демонстрационные данные" />
            <Metric label="Потрачено за всё время" value="₽ 384,72" detail="Демонстрационные данные" />
            <Metric label="Токенов за 48 часов" value="128 450" detail="Демонстрационные данные" />
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]" aria-label="Использование токенов">
          <article className="rounded-[18px] bg-[#1b1b1b] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Расход токенов</h2>
                <p className="mt-1 text-xs text-[#858580]">Последние 48 часов · демонстрационные данные</p>
              </div>
              <span className="rounded-full bg-[#ffe02e]/10 px-3 py-1.5 text-xs font-medium text-[#ffe02e]">128 450 токенов</span>
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
                  tickFormatter={(value) => value === "0 ч. назад" ? "Сейчас" : value.replace(" назад", "")}
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
            <p className="mt-1 text-xs text-[#858580]">Демонстрационные данные</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Запросы</span><span className="text-2xl font-semibold">246</span></div>
              <div className="h-px bg-white/[0.07]" />
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Средний расход</span><span className="text-xl font-semibold sm:text-2xl">522 <span className="text-xs font-normal text-[#858580] sm:text-sm">токена / запрос</span></span></div>
              <div className="h-px bg-white/[0.07]" />
              <div className="flex items-end justify-between gap-3"><span className="text-sm text-[#a5a5a1]">Расход средств</span><span className="text-2xl font-semibold">₽ 42,18</span></div>
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-[18px] bg-[#1b1b1b]" aria-labelledby="requests-title">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 id="requests-title" className="text-base font-semibold">Последние запросы</h2>
              <p className="mt-1 text-xs text-[#858580]">Демонстрационные данные</p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[#a5a5a1]">Последние 48 часов</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.025] text-[11px] font-medium uppercase tracking-wide text-[#777875]"><tr><th className="px-5 py-3 sm:px-6">Модель</th><th className="px-4 py-3">ID запроса</th><th className="px-4 py-3">Время</th><th className="px-4 py-3 text-right">Токены</th><th className="px-4 py-3 text-right">Стоимость</th><th className="px-5 py-3 text-right sm:px-6">Статус</th></tr></thead>
              <tbody>{requests.map((request) => <tr key={request.id} className="border-t border-white/[0.06]">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-[#f3f2ee] sm:px-6">{request.model}</td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-[#858580]">{request.id}</td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-[#a5a5a1]">{request.time}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums">{request.tokens}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums">{request.cost}</td>
                <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6"><span className="inline-flex items-center gap-1.5 text-xs text-[#9fc7a1]"><span className="size-1.5 rounded-full bg-[#82c985]" />{request.status}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
      <TopUpModal
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onSubmit={(amount) => {
          void toast.promise(
            Promise.resolve().then(() => setTopUpOpen(false)),
            {
              loading: "Создаём заявку…",
              success: `Демо-заявка на ₽ ${amount.toLocaleString("ru-RU")} создана`,
              error: "Не удалось создать заявку",
            },
          );
        }}
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
