import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Parse the mysql:// URL into an explicit mariadb PoolConfig so that
// driver-specific params like ?sslaccept are not forwarded to the mariadb
// library, and SSL is configured correctly for TiDB Cloud.
const _url = new URL(connectionString)
const adapter = new PrismaMariaDb({
  host: _url.hostname,
  port: Number(_url.port) || 3306,
  user: decodeURIComponent(_url.username),
  password: decodeURIComponent(_url.password),
  database: _url.pathname.slice(1),
  ssl: { rejectUnauthorized: true },
  connectionLimit: 5,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: ["error"] })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}