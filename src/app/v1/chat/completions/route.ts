import { after } from "next/server";
import { authenticateApiKey } from "@/lib/api-keys";
import { ApiError, errorResponse } from "@/lib/api-error";
import { proxyChat, validateChat } from "@/lib/chat-proxy";
import { readJson } from "@/lib/request-body";
import { CUSTOMER_GENERATION_ENABLED, PROXY_LIMITS } from "@/configs/consts/proxy.const";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const key = await authenticateApiKey(request);
    const body = await readJson(request, PROXY_LIMITS.BODY_BYTES);
    validateChat(body);
    if (!CUSTOMER_GENERATION_ENABLED) {
      throw new ApiError(503, "pricing_not_configured", "Генерация будет доступна после утверждения тарифов");
    }
    const result = await proxyChat(body, {
      userId: key.userId,
      apiKeyId: key.id,
      diagnostic: false,
      signal: request.signal,
    });
    after(() => result.completion);
    return result.response;
  } catch (error) {
    return errorResponse(error);
  }
}
