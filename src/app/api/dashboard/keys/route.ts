import { db } from "@/lib/db";
import { dashboardUser } from "@/lib/dashboard-auth";
import { issueKey, keyName } from "@/lib/api-keys";
import { errorResponse } from "@/lib/api-error";
import { readJson } from "@/lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await dashboardUser();
    const month = new Date();
    month.setUTCDate(1);
    month.setUTCHours(0, 0, 0, 0);
    const [keys, usage] = await Promise.all([
      db.apiKey.findMany({
        where: { userId: user.id, revokedAt: null },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, prefix: true, createdAt: true, lastUsedAt: true },
      }),
      db.apiRequest.groupBy({
        by: ["apiKeyId"],
        where: { userId: user.id, createdAt: { gte: month } },
        _count: { _all: true },
        _sum: { chargedCost: true },
      }),
    ]);
    return Response.json({ keys: keys.map((key) => {
      const summary = usage.find((item) => item.apiKeyId === key.id);
      return {
        ...key,
        requests: summary?._count._all ?? 0,
        spent: summary?._sum.chargedCost?.toFixed(8) ?? "0",
      };
    }) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await dashboardUser(request);
    const body = await readJson(request, 4096);
    return Response.json(await issueKey(user.id, keyName(body.name)), {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
