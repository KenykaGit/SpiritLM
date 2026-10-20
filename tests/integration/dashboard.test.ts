import "../../scripts/load-env.mjs";
import assert from "node:assert/strict";
import { test, after } from "node:test";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "../../src/lib/db";
import { creditBalance } from "../../src/lib/balance";
import { dashboardSummary } from "../../src/lib/dashboard-summary";

import { withBackendFixture } from "../helpers/backend-fixture";

after(() => db.$disconnect());

test("dashboard aggregates actual usage and isolates account history", async () =>
  withBackendFixture(async ({ prefix, user, other, body }) => {
    await creditBalance(
      prefix,
      new Prisma.Decimal("10.00000001"),
      `dashboard-${randomUUID()}`,
      "Integration credit",
    );
    await db.apiRequest.createMany({
      data: [
        {
          totalTokens: 16,
          inputTokens: 14,
          outputTokens: 2,
          cachedTokens: 4,
          status: "SUCCEEDED",
        },
        {
          totalTokens: 16,
          inputTokens: 14,
          outputTokens: 2,
          cachedTokens: 0,
          status: "SUCCEEDED",
        },
        {
          totalTokens: null,
          inputTokens: null,
          outputTokens: null,
          cachedTokens: null,
          status: "INTERRUPTED",
        },
        {
          totalTokens: null,
          inputTokens: null,
          outputTokens: null,
          cachedTokens: null,
          status: "FAILED",
        },
      ].map((request) => ({
        ...request,
        userId: user.id,
        model: body.model,
        upstreamModel: "deepseek-v4-flash",
        streaming: false,
        pricePerMillion: new Prisma.Decimal("0.90"),
      })),
    });
    const summary = await dashboardSummary(
      await db.user.findUniqueOrThrow({ where: { id: user.id } }),
    );
    assert.equal(summary.tokens, 32);
    assert.equal(summary.inputTokens, 28);
    assert.equal(summary.outputTokens, 4);
    assert.equal(summary.cachedTokens, 4);
    assert.equal(
      summary.usage.reduce((total, item) => total + item.tokens, 0),
      32,
    );
    assert.equal(summary.balance, "10.00000001");
    assert.equal(summary.credits.length, 1);
    assert.equal(summary.requestCount, 4);
    assert.equal(summary.unknownUsageCount, 2);
    const isolated = await dashboardSummary(other);
    assert.equal(isolated.tokens, 0);
    assert.equal(isolated.requests.length, 0);
    assert.equal(isolated.credits.length, 0);
  }));
