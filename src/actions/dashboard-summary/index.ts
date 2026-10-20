import {
  DASHBOARD_WINDOW_HOURS,
  HOUR_MS,
  DASHBOARD_HISTORY_LIMIT,
} from "@/configs/consts/dashboard.const";
import { REQUEST_STALE_MS } from "@/configs/consts/proxy.const";
// Internal server operation; do not expose as a client-callable Server Action.
import { createSafeAction } from "@/lib/create-safe-action";
import { InputSchema } from "./schema";
import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import type { DashboardSummary } from "@/configs/types/api.types";
const handler = async (data: InputType): Promise<ReturnType> => {
  const user = await db.user.findUniqueOrThrow({ where: { id: data.userId } });
  const since = new Date(Date.now() - DASHBOARD_WINDOW_HOURS * HOUR_MS);
  const firstHour = new Date(since);
  firstHour.setUTCMinutes(0, 0, 0);
  const [all, recent, requests, buckets, models, credits] = await Promise.all([
    db.apiRequest.aggregate({
      where: { userId: user.id },
      _sum: { chargedCost: true },
    }),
    db.apiRequest.aggregate({
      where: { userId: user.id, createdAt: { gte: since } },
      _count: { _all: true, totalTokens: true },
      _sum: {
        totalTokens: true,
        chargedCost: true,
        inputTokens: true,
        outputTokens: true,
        cachedTokens: true,
        reasoningTokens: true,
      },
    }),
    db.apiRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: DASHBOARD_HISTORY_LIMIT,
      select: {
        id: true,
        model: true,
        createdAt: true,
        totalTokens: true,
        chargedCost: true,
        status: true,
        diagnostic: true,
      },
    }),
    db.apiRequest.findMany({
      where: { userId: user.id, createdAt: { gte: since } },
      select: { createdAt: true, totalTokens: true },
    }),
    db.apiRequest.groupBy({
      by: ["model"],
      where: { userId: user.id, createdAt: { gte: since } },
      _sum: { totalTokens: true },
      _count: { _all: true },
      orderBy: { _sum: { totalTokens: "desc" } },
    }),
    db.balanceEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: DASHBOARD_HISTORY_LIMIT,
      select: { id: true, amount: true, note: true, createdAt: true },
    }),
  ]);
  const hourlyTokens = new Map<number, number>();
  for (const item of buckets) {
    const hour = new Date(item.createdAt);
    hour.setUTCMinutes(0, 0, 0);
    hourlyTokens.set(
      hour.getTime(),
      (hourlyTokens.get(hour.getTime()) ?? 0) + (item.totalTokens ?? 0),
    );
  }
  const response: DashboardSummary = {
    balance: user.balance.toFixed(8),
    spent: all._sum.chargedCost?.toFixed(8) ?? "0",
    tokens: recent._sum.totalTokens ?? 0,
    inputTokens: recent._sum.inputTokens ?? 0,
    outputTokens: recent._sum.outputTokens ?? 0,
    cachedTokens: recent._sum.cachedTokens ?? 0,
    reasoningTokens: recent._sum.reasoningTokens ?? 0,
    requestCount: recent._count._all,
    unknownUsageCount: recent._count._all - recent._count.totalTokens,
    cost48h: recent._sum.chargedCost?.toFixed(8) ?? "0",
    models: models.map((item) => ({
      model: item.model,
      requests: item._count._all,
      tokens: item._sum.totalTokens ?? 0,
    })),
    credits: credits.map((item) => ({
      ...item,
      amount: item.amount.toFixed(8),
      createdAt: item.createdAt.toISOString(),
    })),
    usage: Array.from({ length: DASHBOARD_WINDOW_HOURS + 1 }, (_, index) => {
      const date = new Date(firstHour.getTime() + index * HOUR_MS);
      return {
        time: date.toISOString(),
        tokens: hourlyTokens.get(date.getTime()) ?? 0,
      };
    }),
    requests: requests.map((item) => ({
      ...item,
      status:
        item.status === "RUNNING" &&
        item.createdAt.getTime() < Date.now() - REQUEST_STALE_MS
          ? "INTERRUPTED"
          : item.status,
      createdAt: item.createdAt.toISOString(),
      chargedCost: item.chargedCost.toFixed(8),
    })),
  };
  return { data: response };
};

export const dashboardSummary = createSafeAction(InputSchema, handler);
