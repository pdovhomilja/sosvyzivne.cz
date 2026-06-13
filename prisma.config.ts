import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema.prisma"),
  // Required by Prisma 7 CLI (migrate / studio). Runtime uses the pg driver
  // adapter in lib/db.ts; this is only for the CLI.
  datasource: {
    url: process.env.DATABASE_URL,
  },
} satisfies PrismaConfig;
