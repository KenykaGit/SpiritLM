import Image from "next/image";
import Link from "next/link";
import { SITE_LABELS, SITE_LINKS } from "../../../../configs/links";
import { MODEL_GROUPS } from "../../../../configs/models";
import { Icon } from "./icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Catalog() {
  return (
    <section className="catalog-section section-pad" id="models">
      <div className="section-heading">
        <h2>{SITE_LABELS.catalogTitle}</h2>
        <p>{SITE_LABELS.catalogDescription}</p>
      </div>

      <div className="catalog-groups">
        {MODEL_GROUPS.map((group) => (
          <section className="model-group" key={group.provider}>
            <div className="model-group-heading">
              <Image
                src={group.icon}
                alt=""
                width={34}
                height={34}
                aria-hidden="true"
              />
              <h3>{group.name}</h3>
            </div>

            <div className="catalog-grid">
              {group.models.map((model) => (
                <Card className="catalog-card" key={model.id}>
                  <h4>{model.name}</h4>
                  <p className="model-price">
                    <span>{model.pricePerMillionTokens}</span>
                    <span>{SITE_LABELS.priceUnit}</span>
                  </p>

                  <Button
                    asChild
                    variant="link"
                    className="flex w-full justify-between border-t border-[#3a3932] pt-[10px] [&_svg]:transition-transform [&:hover_svg]:translate-x-[3px]"
                  >
                    <Link href={SITE_LINKS.quickStart}>
                      {SITE_LABELS.modelAction}
                      <Icon name="arrow" size={15} />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
