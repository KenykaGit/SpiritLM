import Image from "next/image";
import Link from "next/link";
import { SITE_LINKS } from "../../../../configs/links";
import { ASSET_PATHS } from "../../../../configs/paths";
import { Icon } from "./icon";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <section className="landing-hero">
      <div className="hero-copy">
        <h1>
          Одна точка входа
          <br />
          в мир ИИ.
        </h1>
        <p>
          Подключайте Claude и GPT через единый API — без лишних интеграций.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-[30px] max-[620px]:mt-[22px]"
        >
          <Link href={SITE_LINKS.quickStart}>
            Начать работу
            <Icon name="arrow" size={17} />
          </Link>
        </Button>
      </div>

      <div
        className="hero-visual"
        aria-label="SpiritLM объединяет модели искусственного интеллекта"
      >
        <div className="hero-mark" aria-hidden="true" />
        <div className="hero-art-wrap">
          <Image
            src={ASSET_PATHS.landingImage}
            alt="Маскот SpiritLM с символами ИИ"
            fill
            priority
            sizes="(max-width: 700px) 90vw, 46vw"
            className="hero-art"
          />
        </div>
      </div>
    </section>
  );
}
