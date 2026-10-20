"use client";

import { IconKey, IconPlus } from "@tabler/icons-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "./modal-shell";

type CreateApiKeyModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

export function CreateApiKeyModal({ open, onClose, onCreate }: CreateApiKeyModalProps) {
  const [name, setName] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName);
    setName("");
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
          onChange={(event) => setName(event.target.value)}
          placeholder="Например, Backend production"
          className="h-11 w-full rounded-xl border border-[#3b3b39] bg-[#101010] px-3 text-sm text-[#f3f2ee] outline-none placeholder:text-[#777875] focus:border-[#ffe02e]/70 focus:ring-2 focus:ring-[#ffe02e]/20"
        />
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
            size="sm"
            className="rounded-lg bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] hover:bg-[#f1d326] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
          >
            <IconPlus aria-hidden="true" size={16} />
            Создать ключ
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
