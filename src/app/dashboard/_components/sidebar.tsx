"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PATHS } from "@/configs/paths/pages.paths";

const items = [
  { label: "Главная", href: PATHS.DASHBOARD.ROOT, icon: "/icons/home.svg" },
  { label: "Модели", href: PATHS.DASHBOARD.MODELS, icon: "/icons/ai.svg" },
  { label: "Документация", href: PATHS.DASHBOARD.DOCS, icon: "/icons/docs.svg" },
  { label: "API-Ключи", href: PATHS.DASHBOARD.KEYS, icon: "/icons/key.svg" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex min-h-[calc(100dvh-3rem)] shrink-0 flex-col bg-[#050505] px-2 py-3 text-[13px] text-[#f3f2ee] transition-[width] duration-200 ${
        collapsed ? "w-14" : "w-[232px]"
      }`}
      aria-label="Навигация дашборда"
    >
      <nav className="flex flex-col gap-1" aria-label="Разделы">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex h-9 items-center gap-2 rounded-lg px-2.5 font-normal transition-colors hover:bg-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e] ${
                active ? "bg-[#242424]" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Image
                src={item.icon}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 brightness-0 invert"
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="mt-auto flex h-9 items-center gap-3 rounded-lg px-2.5 text-[#a5a5a1] transition-colors hover:bg-[#1b1b1b] hover:text-[#f3f2ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe02e]"
        aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
        aria-expanded={!collapsed}
      >
        <span className="w-4 shrink-0 text-center text-lg leading-none" aria-hidden="true">
          {collapsed ? "›" : "‹"}
        </span>
        {!collapsed && <span>Свернуть</span>}
      </button>
    </aside>
  );
}
