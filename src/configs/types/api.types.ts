export type ApiKeySummary = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  requests: number;
  spent: string;
};

export type DashboardSummary = {
  balance: string;
  spent: string;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  reasoningTokens: number;
  requestCount: number;
  unknownUsageCount: number;
  cost48h: string;
  usage: { time: string; tokens: number }[];
  models: { model: string; requests: number; tokens: number }[];
  credits: { id: string; amount: string; note: string; createdAt: string }[];
  requests: {
    id: string;
    model: string;
    createdAt: string;
    totalTokens: number | null;
    chargedCost: string;
    status: string;
    diagnostic: boolean;
  }[];
};
