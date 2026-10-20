import { dashboardUser } from "@/lib/dashboard-auth";
import { dashboardSummary } from "@/lib/dashboard-summary";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await dashboardUser();
    return Response.json(await dashboardSummary(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
