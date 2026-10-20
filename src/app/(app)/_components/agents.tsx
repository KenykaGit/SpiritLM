import Image from "next/image";
import { IMAGES } from "../../../configs/paths/images.paths";

const AGENTS = [
  { name: "Claude Code", image: IMAGES.AGENTS.CLAUDE_CODE },
  { name: "Codex", image: IMAGES.AGENTS.CODEX },
  { name: "Cursor", image: IMAGES.AGENTS.CURSOR, invert: true },
  { name: "Hermes", image: IMAGES.AGENTS.HERMES, invert: true },
  { name: "Kimi Code", image: IMAGES.AGENTS.KIMI_CODE },
  { name: "OpenCode", image: IMAGES.AGENTS.OPEN_CODE, invert: true },
  { name: "VS Code", image: IMAGES.AGENTS.VS_CODE },
] as const;

export function Agents() {
  return (
    <section className="bg-spirit-section" id="agents">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-7 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tighter text-balance sm:text-5xl">
            Поддерживаем все популярные агенты и среды
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-spirit-muted sm:text-base">
            Подключайте SpiritLM к привычным инструментам и работайте с моделями через единый API.
          </p>
        </div>

        <ul className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-7 sm:gap-x-12 lg:mt-14 lg:justify-between">
          {AGENTS.map((agent) => (
            <li key={agent.name} className="flex min-w-24 flex-col items-center gap-3 text-center">
              <Image
                src={agent.image}
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className={`size-10 object-contain sm:size-12 ${
                  agent.invert ? "invert" : ""
                }`}
              />
              <span className="text-sm font-medium text-spirit-text">{agent.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
