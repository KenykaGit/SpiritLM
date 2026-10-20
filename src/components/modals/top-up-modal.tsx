"use client";

import { IconWallet } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "./modal-shell";

type TopUpModalProps = {
  open: boolean;
  onClose: () => void;
};

const suggestedAmounts = [500, 1_000, 2_500, 5_000];

export function TopUpModal({ open, onClose }: TopUpModalProps) {
  const [amount, setAmount] = useState("1000");

  return (
    <ModalShell
      open={open}
      titleId="top-up-title"
      title="Пополнение баланса"
      description="Выберите сумму пополнения."
      icon={<IconWallet aria-hidden="true" size={19} />}
      onClose={onClose}
    >
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-[#c6c6c1]">Сумма, ₽</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {suggestedAmounts.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              aria-pressed={Number(amount) === suggestion}
              variant="outline"
              size="sm"
              onClick={() => setAmount(String(suggestion))}
              className={`min-h-10 rounded-lg border px-2 text-sm font-medium ${
                Number(amount) === suggestion
                  ? "border-[#ffe02e]/50 !bg-[#ffe02e]/10 !text-[#ffe02e] hover:!border-[#ffe02e]/50 hover:!bg-[#ffe02e]/10 hover:!text-[#ffe02e]"
                  : "border-white/[0.08] !bg-[#242424] !text-[#c6c6c1] hover:!border-white/[0.08] hover:!bg-[#30302e] hover:!text-[#f3f2ee]"
              }`}
            >
              {suggestion.toLocaleString("ru-RU")}
            </Button>
          ))}
        </div>
        <label htmlFor="top-up-amount" className="mb-2 mt-4 block text-xs font-medium text-[#c6c6c1]">
          Или укажите другую сумму
        </label>
        <div className="relative">
          <input
            id="top-up-amount"
            type="number"
            min="100"
            max="100000"
            step="100"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#3b3b39] bg-[#101010] px-3 pr-10 text-sm text-[#f3f2ee] outline-none focus:border-[#ffe02e]/70 focus:ring-2 focus:ring-[#ffe02e]/20"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#858580]">₽</span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-[#777875]">
          Онлайн-пополнение пока недоступно. Баланс начисляется вручную администратором.
        </p>
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
            type="button"
            disabled
            size="sm"
            className="rounded-lg bg-[#ffe02e] px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#ffcc36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
          >
            Скоро
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
