import { MODEL_GROUPS } from "./models.const";

export const DOCS_INTEGRATIONS = [
  { id: "model-ids", label: "ID моделей" },
  { id: "claude-code", label: "Claude Code" },
  { id: "codex", label: "Codex" },
  { id: "cursor", label: "Cursor" },
  { id: "hermes", label: "Hermes" },
  { id: "kimi-code", label: "Kimi Code" },
  { id: "opencode", label: "OpenCode" },
  { id: "vscode", label: "VS Code" },
];

export const DOCS_CODE = {
  claudeSettings: JSON.stringify(
    {
      env: {
        ANTHROPIC_BASE_URL: "<SPIRITLM_ANTHROPIC_BASE_URL>",
        ANTHROPIC_AUTH_TOKEN: "<SPIRITLM_API_KEY>",
      },
      model: "anthropic/claude-sonnet-4.6",
      modelPicker: {
        options: MODEL_GROUPS.flatMap((group) =>
          group.models.map((model) => ({ model: model.id, label: model.name })),
        ),
      },
    },
    null,
    2,
  ),
  codex: [
    'model = "openai/gpt-6.1-sol"',
    'model_provider = "spiritlm"',
    "",
    "[model_providers.spiritlm]",
    'name = "SpiritLM"',
    'base_url = "<SPIRITLM_RESPONSES_BASE_URL>"',
    'env_key = "SPIRITLM_API_KEY"',
    'wire_api = "responses"',
  ].join("\n"),
  cursor: [
    "API Key:   <SPIRITLM_API_KEY>",
    "Base URL:  <SPIRITLM_CHAT_COMPLETIONS_BASE_URL>",
    "Model:     anthropic/claude-sonnet-4.6",
  ].join("\n"),
  hermes: [
    "model:",
    "  provider: custom",
    '  base_url: "<SPIRITLM_CHAT_COMPLETIONS_BASE_URL>"',
    '  api_key: "<SPIRITLM_API_KEY>"',
    '  default: "anthropic/claude-sonnet-4.6"',
  ].join("\n"),
  kimi: [
    "[providers.spiritlm]",
    'type = "openai_legacy"',
    'base_url = "<SPIRITLM_CHAT_COMPLETIONS_BASE_URL>"',
    'api_key = "<SPIRITLM_API_KEY>"',
    "",
    "[models.spiritlm-claude]",
    'provider = "spiritlm"',
    'model = "anthropic/claude-sonnet-4.6"',
    "max_context_size = 200000",
  ].join("\n"),
  codexProfiles: MODEL_GROUPS.flatMap((group) =>
    group.models.map((model) => {
      const profileName =
        "spiritlm-" +
        model.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return [
        "# ~/.codex/" + profileName + ".config.toml",
        'model = "' + model.id + '"',
        'model_provider = "spiritlm"',
        "",
      ].join("\n");
    }),
  ).join("\n"),
  clineModels: MODEL_GROUPS.flatMap((group) => [
    group.name,
    ...group.models.map((model) => "  " + model.id),
  ]).join("\n"),
};

export const ALL_MODEL_IDS = MODEL_GROUPS.map(
  (group) =>
    group.name +
    "\n" +
    group.models.map((model) => "  " + model.id).join("\n"),
).join("\n\n");

export const OPENCODE_CONFIG = JSON.stringify(
  {
    $schema: "https://opencode.ai/config.json",
    provider: {
      spiritlm: {
        npm: "@ai-sdk/openai-compatible",
        name: "SpiritLM",
        options: {
          baseURL: "<SPIRITLM_CHAT_COMPLETIONS_BASE_URL>",
          apiKey: "{env:SPIRITLM_API_KEY}",
        },
        models: Object.fromEntries(
          MODEL_GROUPS.flatMap((group) =>
            group.models.map((model) => [model.id, { name: model.name }]),
          ),
        ),
      },
    },
  },
  null,
  2,
);
