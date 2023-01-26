import pg from "pg";
import crypto from "crypto";
import { execSync } from "child_process";
import { beforeAll, afterAll } from "vitest";

const schema = `test_${crypto.randomUUID()}`;
const connectionString = `${process.env.DATABASE_URL}?schema=${schema}`;
process.env.DATABASE_URL = connectionString;
global.process.env.DATABASE_URL = connectionString;

beforeAll(async () => {
  await execSync(`./node_modules/.bin/prisma migrate deploy`);
});

afterAll(async () => {
  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();
});
