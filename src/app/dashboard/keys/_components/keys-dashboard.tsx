"use client";

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
import { useState, type FormEvent } from "react";
import { CreateApiKeyModal } from "@/components/modals/create-api-key-modal";
import { TopUpModal } from "@/components/modals/top-up-modal";

type ApiKey = {
  id: string;
  name: string;
  secret: string;
  createdAt: string;
  lastUsed: string;
  requests: number;
  spent: number;
};

const initialKeys: ApiKey[] = [
  {
    id: "key-prod",
    name: "Production",
    secret: "sk-spirit-demo-4f8c2a1d7b9e6f3a",
    createdAt: "12 окт. 2026",
    lastUsed: "2 мин. назад",
    requests: 1284,
    spent: 128.42,
  },
  {
    id: "key-staging",
    name: "Staging",
    secret: "sk-spirit-demo-9a3d7c5e2b1f8a6d",
    createdAt: "8 окт. 2026",
    lastUsed: "Вчера, 19:04",
    requests: 346,
    spent: 42.18,
  },
  {
    id: "key-local",
    name: "Локальная разработка",
    secret: "sk-spirit-demo-1c6e4b8a0d2f9c7e",
    createdAt: "1 окт. 2026",
    lastUsed: "5 дней назад",
    requests: 28,
    spent: 3.76,
  },
];

export function KeysDashboard() {
  const [keys, setKeys] = useState(initialKeys);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const totalSpent = keys.reduce((total, key) => total + key.spent, 0);
  const totalRequests = keys.reduce((total, key) => total + key.requests, 0);

  async function copyKey(key: ApiKey) {
    const copyPromise = Promise.resolve().then(() => {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API is unavailable");
      }
      return navigator.clipboard.writeText(key.secret);
    });

    try {
      await toast.promise(copyPromise, {
        loading: "Копируем ключ…",
        success: `Ключ «${key.name}» скопирован`,
        error: "Не удалось скопировать ключ",
      });
      setCopiedKey(key.id);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // The promise toast reports clipboard errors.
    }
  }

  function createKey(name: string) {
    if (!name) return;

    void toast.promise(
      Promise.resolve().then(() => {
        const suffix = Math.random().toString(36).slice(2, 18);
        setKeys((current) => [
          {
            id: `key-${Date.now()}`,
            name,
            secret: `sk-spirit-demo-${suffix}`,
            createdAt: "Только что",
            lastUsed: "Ещё не использовался",
            requests: 0,
            spent: 0,
          },
          ...current,
        ]);
        setShowCreateForm(false);
      }),
      {
        loading: "Создаём ключ…",
        success: "Демо-ключ создан",
        error: "Не удалось создать ключ",
      },
    );
  }

  function submitTopUp(amount: number) {
    void toast.promise(
      Promise.resolve().then(() => setShowTopUpForm(false)),
      {
        loading: "Создаём заявку…",
        success: `Демо-заявка на ₽ ${amount.toLocaleString("ru-RU")} создана`,
        error: "Не удалось создать заявку",
      },
    );
  }

  function beginRename(key: ApiKey) {
    setEditingKey(key.id);
    setNameDraft(key.name);
  }

  function saveRename(event: FormEvent<HTMLFormElement>, keyId: string) {
    event.preventDefault();
    const name = nameDraft.trim();
    if (!name) return;
    void toast.promise(
      Promise.resolve().then(() => {
        setKeys((current) => current.map((key) => key.id === keyId ? { ...key, name } : key));
        setEditingKey(null);
        setNameDraft("");
      }),
      {
        loading: "Сохраняем название…",
        success: "Название ключа обновлено",
        error: "Не удалось переименовать ключ",
      },
    );
  }

  function deleteKey(key: ApiKey) {
    void toast.promise(
      Promise.resolve().then(() => setKeys((current) => current.filter((item) => item.id !== key.id))),
      {
        loading: "Удаляем ключ…",
        success: `Ключ «${key.name}» удалён`,
        error: "Не удалось удалить ключ",
      },
    );
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="dashboard-page-title">
      <div className="mx-auto max-w-[1340px]">
        <section className="mb-6 rounded-[20px] border border-white/[0.04] bg-[#1b1b1b] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 id="dashboard-page-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                API-ключи
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#a5a5a1]">
                Управляйте ключами и смотрите расходы по каждому. Все данные демонстрационные.
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
            <Metric label="API-ключи" value={String(keys.length)} detail="Демонстрационные данные" />
            <Metric label="Списания за месяц" value={formatRubles(totalSpent)} detail="Демонстрационные данные" />
            <Metric label="Запросы за месяц" value={totalRequests.toLocaleString("ru-RU")} detail="Демонстрационные данные" />
          </div>
        </section>

        <section className="overflow-hidden rounded-[18px] bg-[#1b1b1b]" aria-labelledby="keys-title">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 id="keys-title" className="text-base font-semibold">Мои ключи</h2>
              <p className="mt-1 text-xs text-[#858580]">Расходы и запросы за текущий месяц</p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[#a5a5a1]">
              {keys.length} {keys.length === 1 ? "ключ" : keys.length > 1 && keys.length < 5 ? "ключа" : "ключей"}
            </span>
          </div>

          {keys.length > 0 ? (
            <ul className="list-none p-0">
              {keys.map((key) => (
                <li key={key.id} className="border-t border-white/[0.06] px-5 py-4 sm:px-6">
                  <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.5fr)_minmax(230px,1fr)_minmax(190px,0.9fr)_auto] lg:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#242424] text-[#bdbdb8]">
                        <IconKey aria-hidden="true" size={17} stroke={1.6} />
                      </span>
                      <div className="min-w-0 flex-1">
                        {editingKey === key.id ? (
                          <form onSubmit={(event) => saveRename(event, key.id)} className="flex gap-2">
                            <label className="sr-only" htmlFor={`rename-${key.id}`}>Новое имя ключа</label>
                            <input
                              id={`rename-${key.id}`}
                              autoFocus
                              required
                              maxLength={48}
                              value={nameDraft}
                              onChange={(event) => setNameDraft(event.target.value)}
                              className="h-9 min-w-0 flex-1 rounded-lg border border-[#3b3b39] bg-[#101010] px-3 text-sm text-[#f3f2ee] outline-none focus:border-[#ffe02e]/70 focus:ring-2 focus:ring-[#ffe02e]/20"
                            />
                            <button type="submit" className="inline-flex size-9 items-center justify-center rounded-lg bg-[#ffe02e] text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]" aria-label="Сохранить название">
                              <IconCheck aria-hidden="true" size={17} />
                            </button>
                            <button type="button" onClick={() => setEditingKey(null)} className="inline-flex size-9 items-center justify-center rounded-lg text-[#999994] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]" aria-label="Отменить переименование">
                              <IconX aria-hidden="true" size={17} />
                            </button>
                          </form>
                        ) : (
                          <>
                            <h3 className="truncate text-sm font-medium text-[#f3f2ee]">{key.name}</h3>
                            <p className="mt-1 truncate font-mono text-[11px] text-[#777875]">{key.secret.slice(0, 15)}••••••••</p>
                          </>
                        )}
                        <p className="mt-1 text-[11px] text-[#777875]">Создан {key.createdAt}</p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 rounded-xl bg-[#242424]/70 px-3 py-2.5 lg:bg-transparent lg:px-0 lg:py-0">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[#777875]">Списания</dt>
                        <dd className="mt-1 text-sm font-medium tabular-nums text-[#f3f2ee]">{formatRubles(key.spent)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[#777875]">Запросы</dt>
                        <dd className="mt-1 text-sm tabular-nums text-[#d0d0cb]">{key.requests.toLocaleString("ru-RU")}</dd>
                      </div>
                    </dl>

                    <p className="text-xs text-[#999994]">
                      <span className="text-[#777875]">Последнее использование · </span>{key.lastUsed}
                    </p>

                    <div className="flex items-center gap-1 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => void copyKey(key)}
                        aria-label={copiedKey === key.id ? `Ключ ${key.name} скопирован` : `Скопировать ключ ${key.name}`}
                        title={copiedKey === key.id ? "Скопировано" : "Скопировать"}
                        className="inline-flex size-10 items-center justify-center rounded-lg text-[#999994] transition-colors hover:bg-white/[0.07] hover:text-[#ffe02e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                      >
                        {copiedKey === key.id ? <IconCheck aria-hidden="true" size={17} /> : <IconCopy aria-hidden="true" size={17} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => beginRename(key)}
                        aria-label={`Переименовать ключ ${key.name}`}
                        title="Переименовать"
                        className="inline-flex size-10 items-center justify-center rounded-lg text-[#999994] transition-colors hover:bg-white/[0.07] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
                      >
                        <IconPencil aria-hidden="true" size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteKey(key)}
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
              <p className="mt-1 text-xs text-[#858580]">Создайте ключ, чтобы начать работу.</p>
            </div>
          )}
        </section>
      </div>

      <CreateApiKeyModal
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={createKey}
      />
      <TopUpModal
        open={showTopUpForm}
        onClose={() => setShowTopUpForm(false)}
        onSubmit={submitTopUp}
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

function formatRubles(value: number) {
  return `₽ ${value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
