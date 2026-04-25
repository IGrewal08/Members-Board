#! /usr/bin/env node
import { Pool } from "pg";
import "dotenv/config";

console.log("DB Pass:", process.env.DATABASE_PASSWORD);
export default new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST || "db",
  database: process.env.DATABASE_NAME,
  password: String(process.env.DATABASE_PASSWORD),
  port: process.env.DATABASE_PORT || 5432,
});