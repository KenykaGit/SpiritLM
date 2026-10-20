"use client";

import { IconKey, IconPlus } from "@tabler/icons-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "./modal-shell";

type CreateApiKeyModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void> | void;
};

export function CreateApiKeyModal({ open, onClose, onCreate }: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || pending) return;
    setPending(true);
    setError(null);
    try {
      await onCreate(trimmedName);
      setName("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось создать ключ");
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      titleId="create-key-title"
      title="Новый API-ключ"
      description="Задайте имя, чтобы различать ключи."
      icon={<IconKey aria-hidden="true" size={19} />}
      onClose={onClose}
    >
      <form onSubmit={submit} className="mt-5">
        <label htmlFor="new-key-name" className="mb-2 block text-xs font-medium text-[#c6c6c1]">
          Название ключа
        </label>
        <input
          id="new-key-name"
          autoFocus
          required
          maxLength={48}
          value={name}
          aria-describedby={error ? "create-key-error" : undefined}
          aria-invalid={error ? true : undefined}
          onChange={(event) => setName(event.target.value)}
          placeholder="Например, Backend production"
          className="h-11 w-full rounded-xl border border-[#3b3b39] bg-[#101010] px-3 text-sm text-[#f3f2ee] outline-none placeholder:text-[#777875] focus:border-[#ffe02e]/70 focus:ring-2 focus:ring-[#ffe02e]/20"
        />
        {error && <p id="create-key-error" role="alert" className="mt-2 text-xs text-[#ffb3a9]">{error}</p>}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="!bg-transparent px-4 text-sm font-medium text-[#bdbdb8] hover:!bg-white/[0.06] hover:!text-[#f3f2ee]"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={pending}
            size="sm"
            className="rounded-lg bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
          >
            <IconPlus aria-hidden="true" size={16} />
            {pending ? "Создаём…" : "Создать ключ"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
