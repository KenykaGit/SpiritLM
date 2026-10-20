import { db } from "@/lib/db";
import { dashboardUser } from "@/lib/dashboard-auth";
import { keyName } from "@/lib/api-keys";
import { ApiError, errorResponse } from "@/lib/api-error";
import { readJson } from "@/lib/request-body";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await dashboardUser(request);
    const { id } = await context.params;
    const body = await readJson(request, 4096);
    const result = await db.apiKey.updateMany({
      where: { id, userId: user.id, revokedAt: null },
      data: { name: keyName(body.name) },
    });
    if (!result.count) throw new ApiError(404, "key_not_found", "Ключ не найден");
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const user = await dashboardUser(request);
    const { id } = await context.params;
    const result = await db.apiKey.updateMany({
      where: { id, userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (!result.count) throw new ApiError(404, "key_not_found", "Ключ не найден");
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
