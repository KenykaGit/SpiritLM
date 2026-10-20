"use client";

import { IconX } from "@tabler/icons-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalShellProps = {
  open: boolean;
  titleId: string;
  title: string;
  description: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

export function ModalShell({
  open,
  titleId,
  title,
  description,
  icon,
  onClose,
  children,
}: ModalShellProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;

    if (open) {
      setMounted(true);
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      timeout = window.setTimeout(() => setMounted(false), 200);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 ease-out motion-reduce:duration-0 ${visible && open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      role="presentation"
      aria-hidden={!open}
      onMouseDown={(event) => {
        if (open && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full max-w-md rounded-[18px] bg-[#1b1b1b] p-5 shadow-2xl transition-[opacity,transform,translate,scale] duration-300 ease-out motion-reduce:duration-0 sm:p-6 ${visible && open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-[#ffe02e]/10 text-[#ffe02e]">
              {icon}
            </span>
            <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-[#999994]">{description}</p>
          </div>
          <Button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-lg !bg-transparent text-[#858580] hover:!bg-white/[0.07] hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
          >
            <IconX aria-hidden="true" size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
