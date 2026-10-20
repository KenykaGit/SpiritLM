import { Prisma } from "@prisma/client";
import { db } from "./db";

export async function creditBalance(clerkId: string, amount: Prisma.Decimal, operationId: string, note: string) {
  if (!clerkId.startsWith("user_") || amount.lte(0) || amount.gt(1_000_000)
    || amount.decimalPlaces() > 8 || !operationId || operationId.length > 191 || !note || note.length > 500) {
    throw new Error("Invalid credit parameters");
  }
  const user = await db.user.upsert({ where: { clerkId }, create: { clerkId }, update: {} });
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM User WHERE id = ${user.id} FOR UPDATE`;
    const existing = await tx.balanceEntry.findUnique({ where: { operationId } });
    if (existing) {
      if (existing.userId !== user.id || !existing.amount.equals(amount) || existing.note !== note) {
        throw new Error("Operation ID already belongs to a different credit");
      }
      return false;
    }
    await tx.balanceEntry.create({ data: { userId: user.id, amount, operationId, note } });
    await tx.user.update({ where: { id: user.id }, data: { balance: { increment: amount } } });
    return true;
  });
}
