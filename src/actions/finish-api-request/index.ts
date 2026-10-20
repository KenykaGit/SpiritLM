// Internal server operation; do not expose as a client-callable Server Action.
import { createSafeAction } from "@/lib/create-safe-action";
import { InputSchema } from "./schema";
import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
const handler = async (data: InputType): Promise<ReturnType> => {
  const result = await db.apiRequest.updateMany({
    where: { id: data.id, status: "RUNNING" },
    data: {
      status: data.status,
      httpStatus: data.httpStatus,
      durationMs: data.durationMs,
      estimatedCost: data.estimatedCost,
      finishedAt: new Date(),
      usageKnown: data.usage !== null,
      ...(data.usage ?? {}),
    },
  });
  return { data: result.count > 0 };
};

export const finishApiRequest = createSafeAction(InputSchema, handler);
