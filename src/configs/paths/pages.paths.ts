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
} as const;
