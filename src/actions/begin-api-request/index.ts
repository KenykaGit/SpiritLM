// Internal server operation; do not expose as a client-callable Server Action.
import { createSafeAction } from "@/lib/create-safe-action";
import { InputSchema } from "./schema";
import type { InputType, ReturnType } from "./types";
import { Prisma } from "@prisma/client";
import { serializableTransaction } from "@/lib/transaction";
import { ApiError } from "@/lib/api-error";
import {
  PROXY_LIMITS,
  REQUEST_STALE_MS,
  RATE_WINDOW_MS,
} from "@/configs/consts/proxy.const";
const handler = async (data: InputType): Promise<ReturnType> => {
  const context = data;
  const record = await serializableTransaction(async (tx) => {
    // Vercel can terminate a function before its final write. Preserve unknown usage.
    await tx.apiRequest.updateMany({
      where: {
        userId: context.userId,
        status: "RUNNING",
        createdAt: { lt: new Date(Date.now() - REQUEST_STALE_MS) },
      },
      data: { status: "INTERRUPTED", finishedAt: new Date() },
    });
    const recent = await tx.apiRequest.count({
      where: {
        userId: context.userId,
        createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) },
      },
    });
    const running = await tx.apiRequest.count({
      where: { userId: context.userId, status: "RUNNING" },
    });
    if (
      recent >= PROXY_LIMITS.REQUESTS_PER_MINUTE ||
      running >= PROXY_LIMITS.CONCURRENT_REQUESTS
    ) {
      throw new ApiError(
        429,
        "rate_limit_exceeded",
        "Слишком много запросов. Повторите позже",
      );
    }
    if (context.apiKeyId) {
      const key = await tx.apiKey.findFirst({
        where: {
          id: context.apiKeyId,
          userId: context.userId,
          revokedAt: null,
        },
      });
      if (!key) throw new ApiError(401, "invalid_api_key", "Ключ отозван");
      await tx.apiKey.update({
        where: { id: key.id },
        data: { lastUsedAt: new Date() },
      });
    }
    return tx.apiRequest.create({
      data: {
        userId: context.userId,
        apiKeyId: context.apiKeyId,
        model: data.model,
        upstreamModel: data.upstreamModel,
        status: "RUNNING",
        streaming: data.streaming,
        diagnostic: context.diagnostic,
        pricePerMillion: new Prisma.Decimal(data.price),
      },
    });
  });
  return { data: record };
};

export const beginApiRequest = createSafeAction(InputSchema, handler);
