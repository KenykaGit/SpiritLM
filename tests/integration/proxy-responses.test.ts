import "../../scripts/load-env.mjs";
import assert from "node:assert/strict";
import { test, after } from "node:test";
import { db } from "../../src/lib/db";
import { proxyChat } from "../../src/lib/chat-proxy";
import { ApiError } from "../../src/lib/api-error";

import { withBackendFixture } from "../helpers/backend-fixture";

after(() => db.$disconnect());

test("customer generation reaches upstream with preliminary prices", async () =>
  withBackendFixture(async ({ body, context, upstream }) => {
    const result = await proxyChat(body, { ...context, diagnostic: false });
    assert.equal(result.response.status, 200);
    assert.equal(upstream.chatCalls, 1);
    await result.completion;
  }));

test("ordinary response records usage and estimates without charging", async () =>
  withBackendFixture(async ({ body, context }) => {
    const result = await proxyChat(body, context);
    assert.equal((await result.response.json()).model, body.model);
    await result.completion;
    const record = await db.apiRequest.findUniqueOrThrow({
      where: { id: result.response.headers.get("x-request-id")! },
    });
    assert.equal(record.status, "SUCCEEDED");
    assert.equal(record.inputTokens, 14);
    assert.equal(record.outputTokens, 2);
    assert.equal(record.cachedTokens, 4);
    assert.equal(record.reasoningTokens, 1);
    assert.equal(record.totalTokens, 16);
    assert.equal(record.chargedCost.toString(), "0");
    assert.equal(record.estimatedCost?.toString(), "0.0000144");
  }));

test("upstream errors do not expose credentials or raw responses", async () =>
  withBackendFixture(async ({ body, context, upstream }) => {
    upstream.reply = () =>
      new Response("private-upstream-details", { status: 429 });
    await assert.rejects(
      proxyChat(body, context),
      (error: unknown) =>
        error instanceof ApiError &&
        error.status === 429 &&
        !error.message.includes("private-upstream-details"),
    );
  }));
