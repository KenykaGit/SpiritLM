"use client";

import type { ApiKeyFundingSettings } from "@/configs/types/subscriptions.types";
import { PATHS } from "@/configs/paths/pages.paths";

import {
  IconCheck,
  IconCopy,
  IconKey,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useEffect, useState, type FormEvent } from "react";
import { CreateApiKeyModal } from "@/components/modals/create-api-key-modal";
import { TopUpModal } from "@/components/modals/top-up-modal";
import { ModalShell } from "@/components/modals/modal-shell";
import type { ApiKeySummary, IssuedApiKey } from "@/configs/types/api.types";
import { dashboardFetch } from "@/lib/dashboard-client";
import { Skeleton } from "../../_components/skeleton";

export function KeysDashboard() {
  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [issuedSecrets, setIssuedSecrets] = useState<Record<string, string>>(
    {},
  );
  const [secret, setSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<ApiKeySummary | null>(null);
  const totalSpent = keys.reduce((total, key) => total + Number(key.spent), 0);
  const totalRequests = keys.reduce((total, key) => total + key.requests, 0);

  useEffect(() => {
    const controller = new AbortController();
    dashboardFetch<{ keys: ApiKeySummary[] }>(PATHS.API.DASHBOARD.KEYS, {
      signal: controller.signal,
    })
      .then((data) => setKeys(data.keys))
      .catch((failure: unknown) => {
        if (!controller.signal.aborted)
          setError(
            failure instanceof Error
              ? failure.message
              : "Не удалось загрузить ключи",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function createKey(name: string, settings: ApiKeyFundingSettings) {
    await toast.promise(
      (async () => {
        const result = await dashboardFetch<IssuedApiKey>(
          PATHS.API.DASHBOARD.KEYS,
          { method: "POST", body: JSON.stringify({ name, ...settings }) },
        );
        setKeys((current) => [
          {
            id: result.id,
            name: result.name,
            prefix: result.prefix,
            createdAt: result.createdAt,
            lastUsedAt: null,
            requests: 0,
            spent: "0",
            subscriptionCreditsUsed: "0",
            useSubscription: result.useSubscription,
            allowBalanceFallback: result.allowBalanceFallback,
          },
          ...current,
        ]);
        setShowCreateForm(false);
        setCopied(false);
        setIssuedSecrets((current) => ({
          ...current,
          [result.id]: result.secret,
        }));
        setSecret(result.secret);
      })(),
      {
        loading: "Создаём ключ…",
        success: "Ключ создан",
        error: (failure) => failure.message,
      },
    );
  }

  async function updateFunding(
    key: ApiKeySummary,
    settings: ApiKeyFundingSettings,
  ) {
    if (pendingKey) return;
    setPendingKey(key.id);
    setKeys((current) =>
      current.map((item) =>
        item.id === key.id ? { ...item, ...settings } : item,
      ),
    );
    try {
      await dashboardFetch(PATHS.API.DASHBOARD.KEY(key.id), {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      toast.success("Настройки ключа сохранены");
    } catch (failure) {
      setKeys((current) =>
        current.map((item) => (item.id === key.id ? key : item)),
      );
      toast.error(
        failure instanceof Error
          ? failure.message
          : "Не удалось сохранить настройки",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function copySecret() {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Ключ скопирован");
    } catch {
      toast.error("Не удалось скопировать ключ. Выделите его вручную.");
    }
  }

  async function copyKey(keyId: string) {
    const value = issuedSecrets[keyId];
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Ключ скопирован");
    } catch {
      toast.error("Не удалось скопировать ключ");
    }
  }

  function beginRename(key: ApiKeySummary) {
    setEditingKey(key.id);
    setNameDraft(key.name);
  }

  function saveRename(event: FormEvent<HTMLFormElement>, keyId: string) {
    event.preventDefault();
    const name = nameDraft.trim();
    if (!name || pendingKey) return;
    const currentName = keys.find((key) => key.id === keyId)?.name;
    if (name === currentName) {
      setEditingKey(null);
      return;
    }
    setPendingKey(keyId);
    void toast
      .promise(
        (async () => {
          await dashboardFetch(PATHS.API.DASHBOARD.KEY(keyId), {
            method: "PATCH",
            body: JSON.stringify({ name }),
          });
          setKeys((current) =>
            current.map((key) => (key.id === keyId ? { ...key, name } : key)),
          );
          setEditingKey(null);
        })(),
        {
          loading: "Сохраняем…",
          success: "Название обновлено",
          error: (failure) => failure.message,
        },
      )
      .catch(() => {})
      .finally(() => setPendingKey(null));
  }

  function deleteKey(key: ApiKeySummary) {
    if (pendingKey) return;
    setPendingKey(key.id);
    void toast
      .promise(
        (async () => {
          await dashboardFetch(PATHS.API.DASHBOARD.KEY(key.id), {
            method: "DELETE",
          });
          setKeys((current) => current.filter((item) => item.id !== key.id));
          setKeyToDelete(null);
        })(),
        {
          loading: "Отзываем ключ…",
          success: "Ключ отозван",
          error: (failure) => failure.message,
        },
      )
      .catch(() => {})
      .finally(() => setPendingKey(null));
  }

  return (
    <main
      className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
      aria-labelledby="dashboard-page-title"
    >
      <div className="mx-auto max-w-[1340px]">
        <section className="mb-6 rounded-[20px] border border-white/[0.04] bg-[#1b1b1b] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                id="dashboard-page-title"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                API-ключи
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#a5a5a1]">
                Управляйте ключами и смотрите расходы по каждому. Секрет ключа
                показывается только один раз при создании.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowTopUpForm(true)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#242424] px-4 text-sm font-semibold text-[#f3f2ee] transition-colors hover:bg-[#30302e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
              >
                Пополнить
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-[background-color,transform] duration-200 hover:bg-[#ffcc36] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
              >
                <IconPlus aria-hidden="true" size={17} stroke={1.8} />
                Создать ключ
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric
              label="API-ключи"
              value={loading || error ? undefined : String(keys.length)}
              loading={loading}
            />
            <Metric
              label="Расход API-баланса за месяц"
              value={loading || error ? undefined : formatRubles(totalSpent)}
              loading={loading}
            />
            <Metric
              label="Запросы за месяц"
              value={
                loading || error
                  ? undefined
                  : totalRequests.toLocaleString("ru-RU")
              }
              loading={loading}
            />
          </div>
        </section>

        <section
          className="overflow-hidden rounded-[18px] bg-[#1b1b1b]"
          aria-labelledby="keys-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 id="keys-title" className="text-base font-semibold">
                Мои ключи
              </h2>
              <p className="mt-1 text-xs text-[#858580]">
                Расходы и запросы за текущий месяц
              </p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[#a5a5a1]">
              {loading || error ? (
                <Skeleton className="h-4 w-8" />
              ) : (
                <>
                  {keys.length}{" "}
                  {keys.length === 1
                    ? "ключ"
                    : keys.length > 1 && keys.length < 5
                      ? "ключа"
                      : "ключей"}
                </>
              )}
            </span>
          </div>

          {loading ? (
            <ul className="list-none p-0" aria-label="Загрузка ключей">
              {[0, 1, 2].map((row) => (
                <li
                  key={row}
                  className="border-t border-white/[0.06] px-5 py-4 sm:px-6"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.5fr)_minmax(320px,1.3fr)_auto] lg:items-center">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </li>
              ))}
            </ul>
          ) : error ? (
            <p className="px-5 py-8 text-sm text-[#a5a5a1]" role="alert">
              {error}
            </p>
          ) : keys.length > 0 ? (
            <ul className="list-none p-0">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className="border-t border-white/[0.06] px-5 py-4 sm:px-6"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.5fr)_minmax(320px,1.3fr)_auto] lg:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#242424] text-[#bdbdb8]">
                        <IconKey aria-hidden="true" size={17} stroke={1.6} />
                      </span>
                      <div className="min-w-0 flex-1">
                        {editingKey === key.id ? (
                          <form
                            onSubmit={(event) => saveRename(event, key.id)}
                            className="flex gap-2"
                          >
                            <label
                              className="sr-only"
                              htmlFor={`rename-${key.id}`}
                            >
                              Новое имя ключа
                            </label>
                            <input
                              id={`rename-${key.id}`}
                              autoFocus
                              required
                              maxLength={48}
                              value={nameDraft}
                              onChange={(event) =>
                                setNameDraft(event.target.value)
                              }
                              className="h-9 min-w-0 flex-1 rounded-lg border border-[#3b3b39] bg-[#101010] px-3 text-sm text-[#f3f2ee] outline-none focus:border-[#ffe02e]/70 focus:ring-2 focus:ring-[#ffe02e]/20"
                            />
                            <button
                              type="submit"
                              className="inline-flex size-9 items-center justify-center rounded-lg bg-[#ffe02e] text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                              aria-label="Сохранить название"
                            >
                              <IconCheck aria-hidden="true" size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingKey(null)}
                              className="inline-flex size-9 items-center justify-center rounded-lg text-[#999994] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                              aria-label="Отменить переименование"
                            >
                              <IconX aria-hidden="true" size={17} />
                            </button>
                          </form>
                        ) : (
                          <>
                            <h3 className="truncate text-sm font-medium text-[#f3f2ee]">
                              {key.name}
                            </h3>
                            <p className="mt-1 truncate font-mono text-[11px] text-[#777875]">
                              {key.prefix}••••••••
                            </p>
                          </>
                        )}
                        <div className="mt-3 space-y-1">
                          <label className="flex min-h-11 items-center gap-2 text-xs text-[#d0d0cb]">
                            <input
                              type="checkbox"
                              checked={key.useSubscription}
                              disabled={pendingKey !== null}
                              onChange={(event) =>
                                void updateFunding(key, {
                                  useSubscription: event.target.checked,
                                  allowBalanceFallback: event.target.checked
                                    ? key.allowBalanceFallback
                                    : false,
                                })
                              }
                              className="accent-[#ffe02e]"
                            />
                            Использовать подписку
                          </label>
                          <label className="flex min-h-11 items-center gap-2 text-xs text-[#a5a5a1]">
                            <input
                              type="checkbox"
                              checked={key.allowBalanceFallback}
                              disabled={
                                pendingKey !== null || !key.useSubscription
                              }
                              onChange={(event) =>
                                void updateFunding(key, {
                                  useSubscription: key.useSubscription,
                                  allowBalanceFallback: event.target.checked,
                                })
                              }
                              className="accent-[#ffe02e]"
                            />
                            Если пакет недоступен — API-баланс
                          </label>
                        </div>
                        <p className="mt-1 text-[11px] text-[#777875]">
                          Создан{" "}
                          {new Date(key.createdAt).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-[#a5a5a1]">
                        Подписка:{" "}
                        {Number(key.subscriptionCreditsUsed).toLocaleString(
                          "ru-RU",
                          { maximumFractionDigits: 8 },
                        )}{" "}
                        кредитов
                      </p>
                      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-[#242424]/70 px-3 py-2.5 sm:grid-cols-3 lg:bg-transparent lg:px-0 lg:py-0">
                        <div>
                          <dt className="text-[10px] uppercase tracking-wide text-[#777875]">
                            API-баланс
                          </dt>
                          <dd className="mt-1 text-sm font-medium tabular-nums text-[#f3f2ee]">
                            {formatRubles(Number(key.spent))}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wide text-[#777875]">
                            Запросы
                          </dt>
                          <dd className="mt-1 text-sm tabular-nums text-[#d0d0cb]">
                            {key.requests.toLocaleString("ru-RU")}
                          </dd>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <dt className="text-[10px] uppercase tracking-wide text-[#777875]">
                            Последнее использование
                          </dt>
                          <dd className="mt-1 text-xs text-[#d0d0cb]">
                            {key.lastUsedAt
                              ? new Date(key.lastUsedAt).toLocaleString("ru-RU")
                              : "Ещё не использовался"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex items-center gap-1 lg:justify-end">
                      {issuedSecrets[key.id] ? (
                        <button
                          type="button"
                          onClick={() => void copyKey(key.id)}
                          aria-label={`Скопировать ключ ${key.name}`}
                          title="Скопировать ключ"
                          className="inline-flex size-10 items-center justify-center rounded-lg text-[#999994] transition-colors hover:bg-white/[0.07] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                        >
                          <IconCopy aria-hidden="true" size={17} />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={pendingKey !== null}
                        onClick={() => beginRename(key)}
                        aria-label={`Переименовать ключ ${key.name}`}
                        title="Переименовать"
                        className="inline-flex size-10 items-center justify-center rounded-lg text-[#999994] transition-colors hover:bg-white/[0.07] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                      >
                        <IconPencil aria-hidden="true" size={17} />
                      </button>
                      <button
                        type="button"
                        disabled={pendingKey !== null}
                        onClick={() => setKeyToDelete(key)}
                        aria-label={`Удалить ключ ${key.name}`}
                        title="Удалить"
                        className="inline-flex size-10 items-center justify-center rounded-lg text-[#999994] transition-colors hover:bg-[#e05a5a]/10 hover:text-[#ff8585] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                      >
                        <IconTrash aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-t border-white/[0.06] px-5 py-12 text-center sm:px-6">
              <p className="text-sm font-medium">Пока нет API-ключей</p>
              <p className="mt-1 text-xs text-[#858580]">
                Создайте ключ, чтобы начать работу.
              </p>
            </div>
          )}
        </section>
      </div>

      <ModalShell
        open={secret !== null}
        titleId="new-secret-title"
        title="Сохраните API-ключ"
        description="Он показывается один раз. После закрытия восстановить секрет нельзя — можно создать новый ключ."
        icon={<IconKey aria-hidden="true" size={19} />}
        onClose={() => setSecret(null)}
      >
        <label htmlFor="new-api-secret" className="sr-only">
          Новый API-ключ
        </label>
        <input
          id="new-api-secret"
          readOnly
          value={secret ?? ""}
          onFocus={(event) => event.target.select()}
          className="mt-5 h-12 w-full rounded-xl bg-[#101010] px-3 font-mono text-xs text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
        />
        <button
          type="button"
          onClick={() => void copySecret()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ffe02e] px-4 py-2 text-sm font-semibold text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
        >
          {copied ? (
            <IconCheck aria-hidden="true" size={16} />
          ) : (
            <IconCopy aria-hidden="true" size={16} />
          )}
          {copied ? "Скопировано" : "Скопировать"}
        </button>
      </ModalShell>
      <CreateApiKeyModal
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={createKey}
      />
      <TopUpModal
        open={showTopUpForm}
        onClose={() => setShowTopUpForm(false)}
      />
      <ModalShell
        open={keyToDelete !== null}
        titleId="delete-key-title"
        title="Удалить API-ключ?"
        description={
          keyToDelete
            ? `Ключ «${keyToDelete.name}» будет отозван. Все приложения, использующие его, потеряют доступ. Это действие нельзя отменить.`
            : ""
        }
        icon={<IconTrash aria-hidden="true" size={19} />}
        onClose={() => {
          if (!pendingKey) setKeyToDelete(null);
        }}
      >
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pendingKey !== null}
            onClick={() => setKeyToDelete(null)}
            className="inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-[#bdbdb8] transition-colors hover:bg-white/[0.06] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={pendingKey !== null || keyToDelete === null}
            onClick={() => {
              if (keyToDelete) deleteKey(keyToDelete);
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#e05a5a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ef6969] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8585] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconTrash aria-hidden="true" size={16} />
            {pendingKey === keyToDelete?.id ? "Удаляем…" : "Удалить ключ"}
          </button>
        </div>
      </ModalShell>
    </main>
  );
}

function Metric({
  label,
  value,
  loading = false,
}: {
  label: string;
  value?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-[14px] bg-[#242424] px-4 py-4">
      <p className="text-xs text-[#999994]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {loading ? <Skeleton className="h-7 w-28" /> : (value ?? "Недоступно")}
      </p>
    </div>
  );
}

function formatRubles(value: number) {
  return `₽ ${value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
