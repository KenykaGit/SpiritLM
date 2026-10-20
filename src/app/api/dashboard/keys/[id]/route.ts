import type { ApiKeyRouteContext } from "@/configs/types/api.types";
import { API_KEY_CONFIG } from "@/configs/consts/api-keys.const";
import { renameApiKey as renameKey } from "@/actions/rename-api-key";
import { revokeApiKey as revokeKey } from "@/actions/revoke-api-key";
import { unwrapAction } from "@/lib/create-safe-action";
import { dashboardUser } from "@/lib/dashboard-auth";
import { keyName } from "@/lib/api-keys";
import { errorResponse } from "@/lib/api-error";
import { readJson } from "@/lib/request-body";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: ApiKeyRouteContext) {
  try {
    await dashboardUser(request);
    const { id } = await context.params;
    const body = await readJson(request, API_KEY_CONFIG.BODY_BYTES);
    unwrapAction(await renameKey({ id, name: keyName(body.name) }));
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: ApiKeyRouteContext) {
  try {
    await dashboardUser(request);
    const { id } = await context.params;
    unwrapAction(await revokeKey({ id }));
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
