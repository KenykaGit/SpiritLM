import { IMAGES } from "../paths/images.paths";
import type { ModelGroup } from "../types/models.types";

// Sample display prices per million tokens. Replace with confirmed rates before launch.
export const MODEL_GROUPS: ModelGroup[] = [
  {
    provider: "anthropic",
    name: "Antropic",
    icon: IMAGES.AI.ANTHROPIC,
    modelProviderName: "Claude",
    modelProviderIcon: IMAGES.AI.CLAUDE,
    models: [
      {
        id: "anthropic/claude-opus-5.5",
        name: "Claude Opus 5.5",
        pricePerMillionTokens: "29₽",
      },
      {
        id: "anthropic/claude-sonnet-5.5",
        name: "Claude Sonnet 5.5",
        pricePerMillionTokens: "14.5₽",
      },
      {
        id: "anthropic/claude-haiku-5.5",
        name: "Claude Haiku 5.5",
        pricePerMillionTokens: "8₽",
      },
    ],
  },
  {
    provider: "openai",
    name: "OpenAI",
    icon: IMAGES.AI.OPENAI,
    modelProviderName: "GPT",
    modelProviderIcon: IMAGES.AI.OPENAI,
    models: [
      {
        id: "openai/gpt-6-astra",
        name: "GPT-6 Astra",
        pricePerMillionTokens: "63₽",
      },
      {
        id: "openai/gpt-6.1-sol",
        name: "GPT-6.1 Sol",
        pricePerMillionTokens: "24₽",
      },
      {
        id: "openai/gpt-6-luna",
        name: "GPT-6 Luna",
        pricePerMillionTokens: "4.5₽",
      },
    ],
  },
];
