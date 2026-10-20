import type { User } from "@prisma/client";
import { dashboardSummary as execute } from "@/actions/dashboard-summary";
import { unwrapAction } from "./create-safe-action";

export async function dashboardSummary(user: Pick<User, "id" | "balance">) {
  return unwrapAction(await execute({ userId: user.id }));
}
