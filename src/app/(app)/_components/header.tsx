import Image from "next/image";
import Link from "next/link";
import { SITE_LINKS } from "../../../../configs/links";
import { ASSET_PATHS } from "../../../../configs/paths";
import { Button } from "@/components/ui/button";
import { Icon } from "./icon";

export function Header() {
  return (
    <section className="mx-auto grid max-w-7xl gap-2 px-5 py-12 sm:px-7 lg:grid-cols-2 lg:items-center lg:px-10">
      <div className="relative z-10 max-w-xl">
        <h1 className="mb-4 font-heading text-5xl font-bold leading-none tracking-tighter text-balance sm:text-6xl lg:mb-5 lg:text-7xl xl:text-8xl">
          Одна точка входа
          <br />
          в мир ИИ.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-spirit-muted sm:text-lg">
          Подключайте Claude и GPT через единый API — без лишних интеграций.
        </p>
        <Button asChild size="lg" className="mt-6 lg:mt-8">
          <Link href={SITE_LINKS.quickStart}>
            Начать работу
            <Icon name="arrow" size={17} />
          </Link>
        </Button>
      </div>

      <div className="relative grid min-h-80 place-items-center isolate sm:min-h-96 lg:min-h-0" aria-label="SpiritLM объединяет модели искусственного интеллекта">
        <div className="absolute -z-10 aspect-square w-64 rotate-[-9deg] rounded-[43%] border border-spirit-mark-border bg-spirit-mark before:absolute before:inset-8 before:rounded-full before:border before:border-spirit-mark-inner before:content-[''] sm:w-72 lg:w-96" aria-hidden="true" />
        <div className="relative h-80 w-full max-w-sm sm:h-96 lg:max-w-md">
          <Image src={ASSET_PATHS.landingImage} alt="Маскот SpiritLM с символами ИИ" fill priority sizes="(max-width: 40rem) 90vw, 46vw" className="object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
