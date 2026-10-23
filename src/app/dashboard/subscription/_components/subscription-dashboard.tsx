"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { ModalShell } from "@/components/modals/modal-shell";
import { PATHS } from "@/configs/paths/pages.paths";
import type {
  SubscriptionMethod,
  SubscriptionOrderSummary,
  SubscriptionPlan,
} from "@/configs/types/subscriptions.types";
import { dashboardFetch } from "@/lib/dashboard-client";
import { useSubscription } from "../../_components/use-subscription";
import { SubscriptionStatus, credits, date } from "./subscription-status";

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ffe02e] px-4 py-2 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b] disabled:cursor-not-allowed disabled:opacity-50";

export function SubscriptionDashboard() {
  const { data, error, refresh } = useSubscription();
  const [selected, setSelected] = useState<SubscriptionPlan | null>(null);
  const [method, setMethod] = useState<SubscriptionMethod>("balance");
  const [pending, setPending] = useState(false);
  const [order, setOrder] = useState<SubscriptionOrderSummary | null>(null);
  const requestId = useRef<string | null>(null);

  const displayedOrder =
    data?.orders.find((item) => item.id === order?.id) ?? order;
  const selectedMode = data?.paymentModes[method];
  const purchasedPeriods =
    selectedMode === "test"
      ? (data?.testPeriods ?? [])
      : (data?.upcoming ?? []);
  const lastPeriod = purchasedPeriods[purchasedPeriods.length - 1];
  const startsAt =
    lastPeriod?.endsAt ??
    (selectedMode === "live" ? data?.current?.endsAt : undefined);

  function selectPlan(plan: SubscriptionPlan) {
    setSelected(plan);
    setOrder(null);
    requestId.current = null;
  }

  async function checkout() {
    if (!selected || pending) return;
    setPending(true);
    requestId.current ??= crypto.randomUUID();
    try {
      const result = await dashboardFetch<{ order: SubscriptionOrderSummary }>(
        PATHS.API.DASHBOARD.SUBSCRIPTION_CHECKOUT,
        {
          method: "POST",
          body: JSON.stringify({
            planId: selected.id,
            method,
            requestId: requestId.current,
          }),
        },
      );
      setOrder(result.order);
      if (result.order.status === "PAID") {
        toast.success(
          result.order.mode === "test"
            ? "Тестовая подписка оформлена"
            : "Подписка оплачена",
        );
        setSelected(null);
      } else if (
        ["FAILED", "EXPIRED", "CANCELLED"].includes(result.order.status)
      ) {
        toast.error(
          "Этот счёт закрыт. Выберите тариф заново для новой покупки.",
        );
      }
      await refresh();
    } catch (failure) {
      toast.error(
        failure instanceof Error
          ? failure.message
          : "Не удалось оплатить подписку",
      );
    } finally {
      setPending(false);
    }
  }

  async function cancelOrder(id: string) {
    if (pending) return;
    setPending(true);
    try {
      await dashboardFetch(PATHS.API.DASHBOARD.SUBSCRIPTION_ORDER(id), {
        method: "DELETE",
      });
      toast.success("Статус счёта обновлён");
      await refresh();
    } catch (failure) {
      toast.error(
        failure instanceof Error ? failure.message : "Не удалось отменить счёт",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
      aria-labelledby="dashboard-page-title"
    >
      <div className="mx-auto max-w-[1340px] space-y-6">
        <div>
          <h1
            id="dashboard-page-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Подписка
          </h1>
          <p className="mt-2 text-sm text-[#a5a5a1]">
            Пакеты для регулярной работы с моделями через API.
          </p>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-[#1b1b1b] p-4 text-sm text-[#ffb3a9]"
          >
            {error}{" "}
            <button
              type="button"
              onClick={() => void refresh()}
              className="ml-2 min-h-11 underline focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
            >
              Повторить
            </button>
          </p>
        )}
        {data ? (
          <SubscriptionStatus data={data} />
        ) : (
          !error && (
            <p
              role="status"
              className="rounded-[20px] bg-[#1b1b1b] p-6 text-[#a5a5a1]"
            >
              Загружаем подписку…
            </p>
          )
        )}
        <section aria-labelledby="subscription-plans-title">
          <h2
            id="subscription-plans-title"
            className="mb-4 text-lg font-semibold"
          >
            Выберите тариф
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {data?.plans.map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col rounded-[15px] bg-[#1b1b1b] p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.id === "vega" && (
                    <span className="rounded-full bg-[#ffe02e]/10 px-2.5 py-1 text-xs text-[#ffe02e]">
                      Для ежедневной работы
                    </span>
                  )}
                </div>
                <p className="mt-5 text-3xl font-semibold tabular-nums">
                  {credits(plan.amount)} ₽{" "}
                  <span className="text-sm font-normal text-[#a5a5a1]">
                    / 30 дней
                  </span>
                </p>
                <ul className="my-6 space-y-3 text-sm leading-6 text-[#d0d0cb]">
                  <li>
                    <strong className="text-[#f3f2ee]">
                      {credits(plan.credits)} кредитов
                    </strong>{" "}
                    на период
                  </li>
                  <li>Генераций одновременно: {plan.concurrentRequests}</li>
                  <li>{plan.requestsPerMinute} запросов в минуту</li>
                  <li>
                    {plan.id === "nova"
                      ? "Без GPT 6 Astra и Claude Fable 5/5.1"
                      : "Все модели каталога"}
                  </li>
                </ul>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => selectPlan(plan)}
                  className={`${buttonClass} mt-auto`}
                >
                  {data.current ? "Оплатить следующий период" : "Выбрать тариф"}
                </button>
              </article>
            ))}
          </div>
        </section>
        <section
          className="rounded-[15px] bg-[#1b1b1b] p-5 sm:p-6"
          aria-labelledby="subscription-conditions-title"
        >
          <h2
            id="subscription-conditions-title"
            className="text-base font-semibold"
          >
            Как расходуется пакет
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#a5a5a1]">
            1 кредит = 1 ₽ использования по стандартным тарифам API. Расход
            зависит от модели, входящих и исходящих токенов. Кредиты действуют
            30 дней, остаток не переносится. Автопродления нет. Купленный
            заранее период начнётся после уже оплаченных периодов.
          </p>
          <p className="mt-3 text-sm leading-6 text-[#a5a5a1]">
            Включите использование подписки в настройках нужных{" "}
            <Link
              href={PATHS.DASHBOARD.KEYS}
              className="text-[#ffe02e] underline focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
            >
              API-ключей
            </Link>
            . Переход на денежный баланс требует отдельного разрешения. Для
            длинных запросов нужен достаточный резерв; уменьшение max_tokens
            уменьшает резерв.
          </p>
        </section>
        {data && data.testPeriods.length > 0 && (
          <section className="rounded-[15px] bg-[#1b1b1b] p-6">
            <h2 className="font-semibold">Тестовые покупки</h2>
            <p className="mt-2 text-sm text-[#a5a5a1]">
              Эти пакеты не дают доступ к реальным генерациям.
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {data.testPeriods.map((period) => (
                <li key={period.id}>
                  {period.planName} · {credits(period.credits)} тестовых
                  кредитов · с {date(period.startsAt)}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section
          className="rounded-[15px] bg-[#1b1b1b] p-5 sm:p-6"
          aria-labelledby="subscription-history-title"
        >
          <h2
            id="subscription-history-title"
            className="text-base font-semibold"
          >
            История покупок
          </h2>
          {data?.orders.length === 0 && (
            <p className="mt-4 text-sm text-[#a5a5a1]">Покупок пока нет.</p>
          )}
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {data?.orders.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
              >
                <div>
                  <p>
                    {item.planName} · {credits(item.amount)} ₽{" "}
                    {item.mode === "test" && (
                      <span className="text-[#ffe02e]">· Тест</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[#a5a5a1]">
                    {date(item.createdAt)} · {methodLabel(item.method)} ·{" "}
                    {statusLabel(item.status)}
                  </p>
                </div>
                {["CREATING", "PENDING"].includes(item.status) && (
                  <div className="flex flex-wrap gap-3">
                    {!item.invoiceUrl && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          const plan = data.plans.find(
                            (p) => p.id === item.planId,
                          );
                          if (plan) {
                            selectPlan(plan);
                            setMethod(
                              item.method === "card" ? "card" : "cryptobot",
                            );
                          }
                        }}
                        className={buttonClass}
                      >
                        Продолжить оформление
                      </button>
                    )}
                    {item.invoiceUrl && (
                      <a
                        href={item.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass}
                      >
                        Оплатить счёт
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void cancelOrder(item.id)}
                      className="min-h-11 rounded-lg px-3 text-[#a5a5a1] hover:bg-[#242424] focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                    >
                      Отменить счёт
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <ModalShell
        open={selected !== null}
        titleId="subscription-checkout-title"
        title={selected ? `Подписка ${selected.name}` : "Подписка"}
        description="Оплата одного периода на 30 дней. Автоматических списаний не будет."
        icon={<IconSparkles aria-hidden="true" size={19} />}
        onClose={() => {
          if (!pending) setSelected(null);
        }}
      >
        <p className="mt-5 text-sm">
          К оплате: <strong>{selected?.amount} ₽</strong>. Начало:{" "}
          {startsAt ? date(startsAt) : "сразу после подтверждения оплаты"}.
        </p>
        <fieldset
          disabled={pending || order !== null}
          className="mt-5 space-y-2"
        >
          <legend className="mb-2 text-sm font-medium">Способ оплаты</legend>
          {(["balance", "card", "cryptobot"] as const).map((value) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-[#242424] px-3 py-2 text-sm"
            >
              <input
                type="radio"
                disabled={!data?.paymentModes[value]}
                name="subscription-method"
                value={value}
                checked={method === value}
                onChange={() => {
                  setMethod(value);
                  requestId.current = null;
                }}
                className="accent-[#ffe02e] focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
              />
              {methodLabel(value)}
              {value === "balance"
                ? ` · ${credits(data?.balance ?? 0)} ₽`
                : !data?.paymentModes[value]
                  ? " · недоступно"
                  : data.paymentModes[value] === "test"
                    ? " · тестовый режим"
                    : ""}
            </label>
          ))}
        </fieldset>
        {selectedMode === "test" && (
          <p className="mt-3 text-xs leading-5 text-[#ffe02e]">
            Выбран тестовый способ оплаты. Тестовая оплата не выдаёт реальных
            кредитов.
          </p>
        )}
        {displayedOrder && (
          <p role="status" className="mt-4 text-sm text-[#a5a5a1]">
            {statusLabel(displayedOrder.status)}.{" "}
            {displayedOrder.status !== "PAID" &&
              "После оплаты статус обновится автоматически."}
          </p>
        )}
        {displayedOrder?.status === "PAID" ? (
          <button
            type="button"
            className={`${buttonClass} mt-5 w-full`}
            onClick={() => setSelected(null)}
          >
            Готово
          </button>
        ) : displayedOrder?.invoiceUrl ? (
          <a
            className={`${buttonClass} mt-5 w-full`}
            href={displayedOrder.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Перейти к оплате
          </a>
        ) : (
          <button
            type="button"
            disabled={
              pending ||
              !selectedMode ||
              (!!displayedOrder && displayedOrder.status !== "CREATING")
            }
            onClick={() => void checkout()}
            className={`${buttonClass} mt-5 w-full`}
          >
            {pending ? "Оформляем…" : "Оплатить подписку"}
          </button>
        )}
      </ModalShell>
    </main>
  );
}

function methodLabel(method: string) {
  return method === "balance"
    ? "Баланс"
    : method === "card"
      ? "Банковская карта"
      : "CryptoBot";
}
function statusLabel(status: string) {
  const labels: Record<string, string> = {
    CREATING: "Счёт создаётся",
    PENDING: "Ожидает оплаты",
    PAID: "Оплачено",
    FAILED: "Ошибка оплаты",
    EXPIRED: "Счёт истёк",
    CANCELLED: "Счёт отменён",
  };
  return labels[status] ?? status;
}
