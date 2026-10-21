export const PATHS = {
  HOME: "/",
  API: {
    DASHBOARD: {
      SUMMARY: "/api/dashboard/summary",
      KEYS: "/api/dashboard/keys",
      KEY: (id: string) => `/api/dashboard/keys/${encodeURIComponent(id)}`,
    },
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    MODELS: "/dashboard/models",
    DOCS: "/dashboard/docs",
    KEYS: "/dashboard/keys",
  },
  DOCS: {
    CONNECTION: "#connection",
    MODELS: "#models",
    CHAT: "#chat",
    STREAM: "#stream",
    SDK: "#sdk",
    LIMITS: "#limits",
    ERRORS: "#errors",
    CLAUDE_CODE: "#claude-code",
    CODEX: "#codex",
    CURSOR: "#cursor",
    HERMES: "#hermes",
    KIMI_CODE: "#kimi-code",
    OPENCODE: "#opencode",
    VSCODE: "#vscode",
    TROUBLESHOOTING: "#troubleshooting",
  },
} as const;
