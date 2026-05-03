import { betterAuth } from "better-auth";
import { pgAdapter } from "better-auth/adapters/pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase") || process.env.NODE_ENV === "production" 
        ? { rejectUnauthorized: false } 
        : false
});

export const auth = betterAuth({
    database: pgAdapter(pool),
    emailAndPassword: {
        enabled: true,
    },
    // Optional: Add OAuth providers here
});
