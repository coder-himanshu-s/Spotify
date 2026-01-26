import { neon } from "@neondatabase/serverless";
import { configDotenv } from "dotenv";
configDotenv();

export const sql = neon(process.env.DB_URL as string);
