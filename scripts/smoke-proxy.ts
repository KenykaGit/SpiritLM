import "./load-env.mjs";
import { db } from "../src/lib/db";
import { proxyChat } from "../src/lib/chat-proxy";
import { ApiError } from "../src/lib/api-error";

async function main() {
  const [clerkId, flag] = process.argv.slice(2);
  if (!clerkId?.startsWith("user_") || (flag !== undefined && flag !== "--stream")) {
    throw new Error("Usage: npm run proxy:smoke -- user_CLERK_ID [--stream]");
  }
  const user = await db.user.upsert({ where: { clerkId }, create: { clerkId }, update: {} });
  const { response, completion } = await proxyChat({
    model: "deepseek-v4-flash",
    messages: [{ role: "user", content: "Reply OK." }],
    max_tokens: 8,
    stream: flag === "--stream",
  }, { userId: user.id, diagnostic: true });
  await response.text();
  await completion;
  const record = await db.apiRequest.findUnique({ where: { id: response.headers.get("x-request-id")! } });
  console.log(JSON.stringify({
    requestId: record?.id,
    status: record?.status,
    inputTokens: record?.inputTokens,
    outputTokens: record?.outputTokens,
    totalTokens: record?.totalTokens,
    usageKnown: record?.usageKnown,
    chargedCost: record?.chargedCost.toString(),
  }, null, 2));
  if (record?.status !== "SUCCEEDED" || !record.usageKnown) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof ApiError ? `${error.code}: ${error.message}` : "Diagnostic failed; inspect request status in the dashboard");
  process.exitCode = 1;
}).finally(() => db.$disconnect());
