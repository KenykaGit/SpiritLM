import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";
import { ApiError } from "./api-error";
import { PROXY_LIMITS } from "@/configs/consts/proxy.const";

export function hashKey(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export async function authenticateApiKey(request: Request) {
  const header = request.headers.get("authorization");
  const secret = header?.match(/^Bearer (sk-spirit-[A-Za-z0-9_-]{43})$/i)?.[1];
  if (!secret) throw new ApiError(401, "invalid_api_key", "Неверный API-ключ SpiritLM");

  const key = await db.apiKey.findUnique({ where: { hash: hashKey(secret) } });
  if (!key || key.revokedAt) {
    throw new ApiError(401, "invalid_api_key", "Неверный API-ключ SpiritLM");
  }
  return key;
}

export function keyName(value: unknown) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 48) {
    throw new ApiError(400, "invalid_name", "Название должно содержать от 1 до 48 символов");
  }
  return value.trim();
}

export async function issueKey(userId: string, name: string) {
  const secret = `sk-spirit-${randomBytes(32).toString("base64url")}`;
  const key = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM User WHERE id = ${userId} FOR UPDATE`;
    const count = await tx.apiKey.count({ where: { userId, revokedAt: null } });
    if (count >= PROXY_LIMITS.ACTIVE_KEYS) {
      throw new ApiError(409, "key_limit", "Можно создать не более 20 активных ключей");
    }
    return tx.apiKey.create({
      data: { userId, name, hash: hashKey(secret), prefix: secret.slice(0, 20) },
      select: { id: true, name: true, prefix: true, createdAt: true },
    });
  });
  return { ...key, secret };
}
