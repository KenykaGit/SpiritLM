# SpiritLM Website Guidelines

## Project structure

- `src/app/(app)/page.tsx` composes the public landing page.
- `src/app/(app)/_components/` contains one focused component per landing page section: navigation, hero, model catalog, quick start, and footer.
- `src/app/globals.css` contains the site-wide styles and responsive layouts.
- `configs/` is the source of truth for reusable site configuration:
  - `types.ts` defines shared TypeScript data shapes.
  - `paths.ts` defines public asset paths and page anchors.
  - `links.ts` defines navigation destinations and shared interface labels.
  - `models.ts` defines model categories, model names, icons, and displayed prices.
- `public/` contains the brand assets and model icons used by the site.

## Implementation rules

- Keep the public website focused on the landing page unless the product brief explicitly requests another route.
- Keep page composition in `page.tsx`; put section markup and behavior in the matching component under `_components/`.
- Move shared labels, links, paths, model data, and reusable data types into `configs/`. Avoid duplicating those values in JSX.
- Import model icons and other public images from the asset paths in `configs/paths.ts`.
- Keep the model groups data-driven. Render each provider and its models from `configs/models.ts` instead of writing repeated cards by hand.
- Display model prices as sample values until the product owner confirms production rates. Keep this status documented next to the values in the configuration.
- Use real destinations for links. For in-page actions, point to an existing section anchor; do not add links to routes that do not exist.
- Preserve semantic HTML, descriptive image alt text, keyboard focus states, and responsive layouts.
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
