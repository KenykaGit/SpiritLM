# SpiritLM Website Guidelines

## Project structure

- `src/app/(app)/page.tsx` composes the public landing page.
- `src/app/(app)/_components/` contains one focused component per landing page section: navigation, hero, model catalog, quick start, and footer.
- `src/app/globals.css` contains only Tailwind imports and configuration; do not add page or component styles there.
- `src/configs/` contains reusable configuration organized by purpose and page/category:
  - `consts/` contains constants in focused files such as `api.const.ts` and `models.const.ts`; do not collect unrelated values in a generic `spiritlm.consts.ts`.
  - `types/` contains focused shared data types, grouped by category such as `models.types.ts`.
  - `paths/` contains public asset paths and in-page anchors in separate files; `links.paths.ts` contains external destinations only.
- `public/` contains the brand assets and model icons used by the site.

## Implementation rules

- Keep the public website focused on the landing page unless the product brief explicitly requests another route.
- Keep page composition in `page.tsx`; put section markup and behavior in the matching component under `_components/`.
- Keep reusable API values, model data, page paths, links, and shared types in focused files under `src/configs/`. Do not move page or button copy into configuration; write user-facing text in the relevant page component.
- Export these path configuration objects as `IMAGES`, `PATHS`, and `LINKS`, with uppercase property names. Keep external destinations such as Telegram in `LINKS`; keep in-page anchors in `PATHS`.
- Organize image paths to mirror the `public/` directory structure (for example, `AI.OPENAI` maps to `/ai/gpt.png`). Import public images from `src/configs/paths/images.paths.ts`.
- Keep model groups data-driven. Render each provider and its models from `src/configs/consts/models.const.ts` instead of writing repeated cards by hand.
- Display model prices as sample values until the product owner confirms production rates. Keep this status documented next to the values in the configuration.
- Use real destinations for links. For in-page actions, point to an existing section anchor; do not add links to routes that do not exist.
- Preserve semantic HTML, descriptive image alt text, keyboard focus states, and responsive layouts.
- Style pages and components with Tailwind utility classes or shadcn/ui. Do not add page/component selectors to `src/app/globals.css` or create custom `auth-*` styling classes.
- Follow the existing SpiritLM visual system in `DESIGN.md` and reuse its brand assets from `public/`.

## Code style

- Format TypeScript, TSX, and CSS as readable multi-line code. Put object properties, JSX props, and long expressions on separate lines when needed.
- Use strict TypeScript types for shared configuration. Avoid `any` and avoid repeating string unions when a shared type exists.
- Use clear, descriptive names in English for code identifiers and comments. User-facing copy remains in Russian unless requested otherwise.
- Keep components small and specific to one page section. Extract shared values into `configs/` rather than building a generic component system for one-off markup.
- Do not add dependencies for simple formatting or UI needs when the existing stack can handle them.

## Before finishing changes

- DONT Run `npm run build`
- When changing the model catalog, confirm that provider icons load from `public/ai/` and that each model displays its configured price per 1 MTok.
