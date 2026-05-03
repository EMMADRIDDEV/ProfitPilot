import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase") || process.env.NODE_ENV === "production" 
        ? { rejectUnauthorized: false } 
        : false
});

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        process.env.BETTER_AUTH_URL || "",
        process.env.NEXT_PUBLIC_APP_URL || "",
        "https://profit-pilot-v1.vercel.app",
    ].filter(Boolean),
});
