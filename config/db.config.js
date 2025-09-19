#! /usr/bin/env node
import { Pool } from "pg";
import "dotenv/config";

export default new Pool({
  user: process.env.ROLE_NAME,
  host: "localhost",
  database: process.env.DATABASE_NAME,
  port: process.env.PORT,
});