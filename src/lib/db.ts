import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const url = new URL(process.env.DATABASE_URL ?? "mysql://unused:unused@localhost:3306/spiritlm");
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 3,
    connectTimeout: 15_000,
    acquireTimeout: 15_000,
    timezone: "+00:00",
    ssl: url.searchParams.get("sslaccept") === "strict"
      ? { rejectUnauthorized: true }
      : undefined,
  });
  return new PrismaClient({ adapter, log: [] });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
