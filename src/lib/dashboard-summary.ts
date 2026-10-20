import { Prisma, type User } from "@prisma/client";
import { db } from "./db";
import type { DashboardSummary } from "@/configs/types/api.types";

type HourUsage = { hour: Date; tokens: Prisma.Decimal | bigint | null };

export async function dashboardSummary(user: Pick<User, "id" | "balance">): Promise<DashboardSummary> {
  const since = new Date(Date.now() - 48 * 3_600_000);
  const firstHour = new Date(since);
  firstHour.setUTCMinutes(0, 0, 0);
  const [all, recent, requests, buckets, models, credits] = await Promise.all([
    db.apiRequest.aggregate({ where: { userId: user.id }, _sum: { chargedCost: true } }),
    db.apiRequest.aggregate({
      where: { userId: user.id, createdAt: { gte: since } },
      _count: { _all: true, totalTokens: true },
      _sum: { totalTokens: true, chargedCost: true, inputTokens: true, outputTokens: true, cachedTokens: true, reasoningTokens: true },
    }),
    db.apiRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, model: true, createdAt: true, totalTokens: true, chargedCost: true, status: true, diagnostic: true },
    }),
    db.$queryRaw<HourUsage[]>`
      SELECT STR_TO_DATE(DATE_FORMAT(createdAt, '%Y-%m-%d %H:00:00'), '%Y-%m-%d %H:%i:%s') AS hour,
             SUM(totalTokens) AS tokens
      FROM ApiRequest
      WHERE userId = ${user.id} AND createdAt >= ${since}
      GROUP BY hour ORDER BY hour
    `,
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
      take: 20,
      select: { id: true, amount: true, note: true, createdAt: true },
    }),
  ]);
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
    models: models.map((item) => ({ model: item.model, requests: item._count._all, tokens: item._sum.totalTokens ?? 0 })),
    credits: credits.map((item) => ({ ...item, amount: item.amount.toFixed(8), createdAt: item.createdAt.toISOString() })),
    usage: Array.from({ length: 49 }, (_, index) => {
      const date = new Date(firstHour.getTime() + index * 3_600_000);
      const bucket = buckets.find((item) => item.hour.getTime() === date.getTime());
      return { time: date.toISOString(), tokens: Number(bucket?.tokens ?? 0) };
    }),
    requests: requests.map((item) => ({
      ...item,
      status: item.status === "RUNNING" && item.createdAt.getTime() < Date.now() - 120_000 ? "INTERRUPTED" : item.status,
      createdAt: item.createdAt.toISOString(),
      chargedCost: item.chargedCost.toFixed(8),
    })),
  };
  return response;
}
