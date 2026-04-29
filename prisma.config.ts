import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "./server/node_modules/prisma/config";

const envPath = "server/.env";

if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  const databaseUrl = envFile
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith("DATABASE_URL="))
    ?.split("=")
    .slice(1)
    .join("=")
    .trim()
    .replace(/^["']|["']$/g, "");

  if (databaseUrl) {
    process.env.DATABASE_URL ??= databaseUrl;
  }
}

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: {
    path: "server/prisma/migrations",
    seed: "cd server && ts-node prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
