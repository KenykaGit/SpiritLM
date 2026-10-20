import Image from "next/image";
import Link from "next/link";
import { SITE_LABELS, SITE_LINKS } from "../../../../configs/links";
import { ASSET_PATHS } from "../../../../configs/paths";
import { Icon } from "./icon";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="landing-header">
      <Link
        className="landing-brand"
        href={SITE_LINKS.home}
        aria-label="SpiritLM — главная"
      >
        <Image
          src={ASSET_PATHS.logo}
          alt="SpiritLM"
          width={124}
          height={32}
          priority
        />
      </Link>

      <nav className="flex items-center gap-[9px] max-[620px]:gap-1.5" aria-label="Основные действия">
        <Button
          asChild
          size="sm"
          className="max-[620px]:min-h-[35px] max-[620px]:gap-[5px] max-[620px]:px-[9px] max-[620px]:text-[10px] max-[360px]:gap-1 max-[360px]:text-[9px]"
        >
          <Link href={SITE_LINKS.navbarAction}>
            {SITE_LABELS.navbarAction}
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-[#393936] hover:border-[#62615a] max-[620px]:min-h-[35px] max-[620px]:px-[9px] max-[620px]:text-[10px]"
        >
          <Link href={SITE_LINKS.quickStart}>{SITE_LABELS.navbarLogin}</Link>
        </Button>
      </nav>
    </header>
  );
}
