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
  const reservation = new Prisma.Decimal(data.reservation);
  if (reservation.isNegative() || (!context.diagnostic && reservation.isZero()))
    throw new ApiError(400, "invalid_reservation", "Некорректный резерв");

  const record = await serializableTransaction(async (tx) => {
    // Vercel can terminate a function before its final write. Keep the reserve
    // for billable requests whose final usage is unknown.
    const staleRequests = await tx.apiRequest.findMany({
      where: {
        userId: context.userId,
        status: "RUNNING",
        createdAt: { lt: new Date(Date.now() - REQUEST_STALE_MS) },
      },
      select: { id: true, diagnostic: true },
    });
    for (const stale of staleRequests) {
      const reserveEntry = stale.diagnostic
        ? null
        : await tx.balanceEntry.findUnique({
            where: {
              operationId: `api-request:${stale.id}:reserve`,
            },
            select: { amount: true },
          });
      const reservedCost = reserveEntry?.amount.negated() ?? new Prisma.Decimal(0);
      await tx.apiRequest.updateMany({
        where: { id: stale.id, status: "RUNNING" },
        data: {
          status: "INTERRUPTED",
          finishedAt: new Date(),
          chargedCost: reservedCost,
        },
      });
      if (reservedCost.gt(0)) {
        await tx.balanceEntry.updateMany({
          where: {
            operationId: `api-request:${stale.id}:reserve`,
          },
          data: { note: `Списание резерва запроса ${stale.id}` },
        });
      }
    }
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
    const request = await tx.apiRequest.create({
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
    if (!context.diagnostic) {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: context.userId },
        select: { balance: true },
      });
      if (user.balance.lt(reservation)) {
        throw new ApiError(
          402,
          "insufficient_balance",
          "Недостаточно средств для резерва запроса",
        );
      }
      await tx.user.update({
        where: { id: context.userId },
        data: { balance: { decrement: reservation } },
      });
      await tx.balanceEntry.create({
        data: {
          userId: context.userId,
          operationId: `api-request:${request.id}:reserve`,
          amount: reservation.negated(),
          note: `Резерв запроса ${request.id}`,
        },
      });
    }
    return request;
  });
  return { data: record };
};

export const beginApiRequest = createSafeAction(InputSchema, handler);
