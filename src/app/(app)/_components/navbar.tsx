import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "../../../configs/paths/images.paths";
import { PATHS } from "../../../configs/paths/pages.paths";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="relative z-10 flex h-16 items-center justify-between border-b border-spirit-border-subtle bg-spirit-header px-5 sm:px-7 lg:px-10">
      <Link className="inline-flex items-center" href={PATHS.HOME} aria-label="SpiritLM — главная">
        <Image className="size-8" src={IMAGES.ICON} alt="SpiritLM" width={32} height={32} priority />
      </Link>

      <nav className="flex items-center gap-2" aria-label="Основные действия">
        <Button asChild size="sm" className="px-2 text-xs sm:px-3">
          <Link href={PATHS.MODELS}>Перейти</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="border border-spirit-border hover:border-spirit-muted">
          <Link href={PATHS.AGENTS}>Агенты</Link>
        </Button>
      </nav>
    </header>
  );
}
