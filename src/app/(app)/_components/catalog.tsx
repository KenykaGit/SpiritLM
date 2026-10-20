import Image from "next/image";
import Link from "next/link";
import { MODEL_GROUPS } from "../../../configs/consts/models.const";
import { PATHS } from "../../../configs/paths/pages.paths";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "./icon";

export function Catalog() {
  return (
    <section className="border-t border-spirit-border-subtle" id="models">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-7 lg:px-10 lg:py-20">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tighter text-balance sm:text-5xl">
            Выберите модель
          </h2>
          <p className="m-0 text-sm text-spirit-muted">Один API для Claude и GPT</p>
        </div>

        <div className="grid gap-8 lg:gap-10">
          {MODEL_GROUPS.map((group) => (
            <section key={group.provider}>
              <div className="mb-4 flex items-center gap-3">
                <Image src={group.icon} alt="" width={34} height={34} aria-hidden="true" />
                <h3 className="font-heading text-2xl font-semibold tracking-tight">{group.name}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {group.models.map((model) => (
                  <Card className="flex min-h-40 flex-col p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-spirit-surface-hover sm:min-h-48 sm:p-5" key={model.id}>
                    <h4 className="mb-4 text-lg font-semibold tracking-tight">{model.name}</h4>
                    <p className="mb-4 mt-auto flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tracking-tight tabular-nums">{model.pricePerMillionTokens}</span>
                      <span className="text-xs text-spirit-muted">за 1 MTok</span>
                    </p>
                    <Button asChild variant="link" className="flex w-full justify-between border-t border-spirit-border pt-2 [&_svg]:transition-transform [&:hover_svg]:translate-x-1">
                      <Link href={PATHS.QUICK_START}>
                        Использовать модель
                        <Icon name="arrow" size={15} />
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
