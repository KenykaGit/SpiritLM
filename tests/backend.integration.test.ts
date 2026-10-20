import "../scripts/load-env.mjs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "../src/lib/db";
import { authenticateApiKey, issueKey } from "../src/lib/api-keys";
import { proxyChat } from "../src/lib/chat-proxy";
import { creditBalance } from "../src/lib/balance";
import { ApiError } from "../src/lib/api-error";
import { readJson } from "../src/lib/request-body";
import { dashboardSummary } from "../src/lib/dashboard-summary";
import { POST as chatRoute } from "../src/app/v1/chat/completions/route";

// Requires migrated DATABASE_URL. Creates temporary, isolated users and removes
// their records afterwards. All upstream traffic is mocked; no tokens are spent.
test("SpiritLM database and proxy integration", async (suite) => {
  const prefix = `user_spiritlm_test_${randomUUID()}`;
  const users: string[] = [];
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.CHEAPVIBE_API_KEY;
  process.env.CHEAPVIBE_API_KEY = "test-upstream-key";
  let chatCalls = 0;
  let expectedModel = "deepseek-v4-flash";
  let expectedTokenLimit: number | undefined = 8;
  let reply: () => Response = () => Response.json({
    model: "deepseek-v4-flash",
    choices: [{ message: { role: "assistant", content: "OK" } }],
    usage: {
      prompt_tokens: 14,
      completion_tokens: 2,
      total_tokens: 16,
      prompt_tokens_details: { cached_tokens: 4 },
      completion_tokens_details: { reasoning_tokens: 1 },
    },
  });
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.equal(new URL(url).origin, "https://ru.cheapvibecode.ru");
    if (url.endsWith("/models")) return Response.json({ data: [
      { id: "deepseek-v4-flash", max_output_tokens: 128_000 },
      { id: "deepseek-v4.1-flash", max_output_tokens: 393_216 },
    ] });
    assert.equal(url, "https://ru.cheapvibecode.ru/v1/chat/completions");
    const payload = JSON.parse(String(init?.body));
    assert.equal(payload.model, expectedModel);
    assert.equal(payload.max_tokens, expectedTokenLimit);
    chatCalls += 1;
    return reply();
  };

  try {
    const user = await db.user.create({ data: { clerkId: prefix } });
    users.push(user.id);
    const other = await db.user.create({ data: { clerkId: `${prefix}_other` } });
    users.push(other.id);
    const key = await issueKey(user.id, "Integration");
    const authorized = () => new Request("https://spiritlm.example/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key.secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "user", content: "OK" }], max_tokens: 8 }),
    });
    const body = { model: "deepseek/deepseek-v4-flash", messages: [{ role: "user", content: "OK" }], max_tokens: 8 };
    const context = { userId: user.id, apiKeyId: key.id, diagnostic: true };

    await suite.test("keys authenticate, stay hashed, and isolate users", async () => {
      assert.equal((await authenticateApiKey(authorized())).id, key.id);
      const stored = await db.apiKey.findUniqueOrThrow({ where: { id: key.id } });
      assert.equal(stored.hash.length, 64);
      assert.ok(!JSON.stringify(stored).includes(key.secret));
      const changed = await db.apiKey.updateMany({ where: { id: key.id, userId: other.id }, data: { name: "Wrong owner" } });
      assert.equal(changed.count, 0);
      await assert.rejects(authenticateApiKey(new Request("https://spiritlm.example/v1/models")), (error: unknown) => error instanceof ApiError && error.status === 401);
    });

    await suite.test("unapproved customer generation never reaches upstream", async () => {
      const response = await chatRoute(authorized());
      assert.equal(response.status, 503);
      assert.equal((await response.json()).error.code, "pricing_not_configured");
      assert.equal(chatCalls, 0);
    });

    await suite.test("JSON body limits reject oversized input", async () => {
      const request = new Request("https://spiritlm.example", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: "x".repeat(5000) }),
      });
      await assert.rejects(readJson(request, 4096), (error: unknown) => error instanceof ApiError && error.status === 413);
    });

    await suite.test("ordinary response records usage and estimates without charging", async () => {
      const result = await proxyChat(body, context);
      assert.equal((await result.response.json()).model, body.model);
      await result.completion;
      const record = await db.apiRequest.findUniqueOrThrow({ where: { id: result.response.headers.get("x-request-id")! } });
      assert.equal(record.status, "SUCCEEDED");
      assert.equal(record.inputTokens, 14);
      assert.equal(record.outputTokens, 2);
      assert.equal(record.cachedTokens, 4);
      assert.equal(record.reasoningTokens, 1);
      assert.equal(record.totalTokens, 16);
      assert.equal(record.chargedCost.toString(), "0");
      assert.equal(record.estimatedCost?.toString(), "0.0000144");
    });

    await suite.test("SSE survives split UTF-8 and split CRLF, retaining usage", async () => {
      const source = new TextEncoder().encode([
        'data: {"model":"deepseek-v4-flash","choices":[{"delta":{"content":"Привет"}}]}',
        '',
        'data: {"choices":[],"usage":{"prompt_tokens":14,"completion_tokens":2,"total_tokens":16}}',
        '',
        'data: [DONE]', '', '',
      ].join("\r\n"));
      let offset = 0;
      reply = () => new Response(new ReadableStream({
        pull(controller) {
          if (offset === source.length) return controller.close();
          controller.enqueue(source.slice(offset, ++offset));
        },
      }), { headers: { "Content-Type": "text/event-stream" } });
      const result = await proxyChat({ ...body, stream: true }, context);
      const text = await result.response.text();
      await result.completion;
      assert.ok(text.includes("Привет"));
      assert.ok(text.includes(body.model));
      assert.ok(text.includes("data: [DONE]"));
      const record = await db.apiRequest.findUniqueOrThrow({ where: { id: result.response.headers.get("x-request-id")! } });
      assert.equal(record.totalTokens, 16);
      assert.equal(record.usageKnown, true);
    });

    await suite.test("truncated SSE remains unknown usage instead of zero tokens", async () => {
      reply = () => new Response('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n', { headers: { "Content-Type": "text/event-stream" } });
      const result = await proxyChat({ ...body, stream: true }, context);
      await assert.rejects(result.response.text());
      await result.completion;
      const record = await db.apiRequest.findUniqueOrThrow({ where: { id: result.response.headers.get("x-request-id")! } });
      assert.equal(record.status, "INTERRUPTED");
      assert.equal(record.usageKnown, false);
      assert.equal(record.totalTokens, null);
    });

    await suite.test("upstream errors do not expose credentials or raw responses", async () => {
      reply = () => new Response("private-upstream-details", { status: 429 });
      await assert.rejects(proxyChat(body, context), (error: unknown) => (
        error instanceof ApiError && error.status === 429 && !error.message.includes("private-upstream-details")
      ));
    });

    await suite.test("credits are atomic, exact and idempotent under concurrency", async () => {
      const operation = `test-${randomUUID()}`;
      const results = await Promise.all([
        creditBalance(prefix, new Prisma.Decimal("10.00000001"), operation, "Integration credit"),
        creditBalance(prefix, new Prisma.Decimal("10.00000001"), operation, "Integration credit"),
      ]);
      assert.equal(results.filter(Boolean).length, 1);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: user.id } })).balance.toFixed(8), "10.00000001");
      await assert.rejects(creditBalance(prefix, new Prisma.Decimal("20"), operation, "Integration credit"));
      assert.equal(await db.balanceEntry.count({ where: { userId: user.id } }), 1);
    });

    await suite.test("dashboard aggregates actual usage and isolates account history", async () => {
      const summary = await dashboardSummary(await db.user.findUniqueOrThrow({ where: { id: user.id } }));
      assert.equal(summary.tokens, 32);
      assert.equal(summary.inputTokens, 28);
      assert.equal(summary.outputTokens, 4);
      assert.equal(summary.cachedTokens, 4);
      assert.equal(summary.usage.reduce((total, item) => total + item.tokens, 0), 32);
      assert.equal(summary.balance, "10.00000001");
      assert.equal(summary.credits.length, 1);
      assert.equal(summary.requestCount, 4);
      assert.equal(summary.unknownUsageCount, 2);
      const isolated = await dashboardSummary(other);
      assert.equal(isolated.tokens, 0);
      assert.equal(isolated.requests.length, 0);
      assert.equal(isolated.credits.length, 0);
    });

    await suite.test("coding client output limits pass through without a 4096 ceiling", async () => {
      reply = () => Response.json({
        choices: [{ message: { role: "assistant", content: "OK" } }],
        usage: { prompt_tokens: 14, completion_tokens: 2, total_tokens: 16 },
      });
      expectedModel = "deepseek-v4.1-flash";
      expectedTokenLimit = 32_768;
      const result = await proxyChat({
        ...body,
        model: "deepseek/deepseek-v4.1-flash",
        max_tokens: 32_768,
      }, context);
      assert.equal(result.response.status, 200);
      await result.response.json();
      await result.completion;
      expectedModel = "deepseek-v4-flash";
      expectedTokenLimit = undefined;
      const defaults = await proxyChat({ model: body.model, messages: body.messages }, context);
      await defaults.response.json();
      await defaults.completion;
      expectedTokenLimit = 8;
      const before = chatCalls;
      await assert.rejects(proxyChat({ ...body, max_tokens: 128_001 }, context), (error: unknown) => (
        error instanceof ApiError && error.code === "invalid_token_limit"
      ));
      assert.equal(chatCalls, before);
    });

    await suite.test("concurrency limit and cancellation finalize request records", async () => {
      reply = () => new Response('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n', { headers: { "Content-Type": "text/event-stream" } });
      const first = await proxyChat({ ...body, stream: true }, context);
      const second = await proxyChat({ ...body, stream: true }, context);
      await assert.rejects(proxyChat(body, context), (error: unknown) => error instanceof ApiError && error.status === 429);
      await first.response.body!.cancel();
      await second.response.body!.cancel();
      await Promise.all([first.completion, second.completion]);
      assert.equal(await db.apiRequest.count({ where: { userId: user.id, status: "RUNNING" } }), 0);
    });

    await suite.test("request rate limit is enforced across persisted requests", async () => {
      const count = await db.apiRequest.count({ where: { userId: user.id } });
      await db.apiRequest.createMany({ data: Array.from({ length: 20 - count }, () => ({
        userId: user.id,
        model: body.model,
        upstreamModel: "deepseek-v4-flash",
        streaming: false,
        diagnostic: true,
        status: "FAILED",
        pricePerMillion: new Prisma.Decimal("0.90"),
      })) });
      await assert.rejects(proxyChat(body, context), (error: unknown) => error instanceof ApiError && error.status === 429);
    });

    await suite.test("revoked key immediately loses access", async () => {
      await db.apiKey.update({ where: { id: key.id }, data: { revokedAt: new Date() } });
      await assert.rejects(authenticateApiKey(authorized()), (error: unknown) => error instanceof ApiError && error.status === 401);
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.CHEAPVIBE_API_KEY;
    else process.env.CHEAPVIBE_API_KEY = originalKey;
    if (users.length) {
      await db.apiRequest.deleteMany({ where: { userId: { in: users } } });
      await db.balanceEntry.deleteMany({ where: { userId: { in: users } } });
      await db.apiKey.deleteMany({ where: { userId: { in: users } } });
      await db.user.deleteMany({ where: { id: { in: users } } });
    }
    await db.$disconnect();
  }
});
