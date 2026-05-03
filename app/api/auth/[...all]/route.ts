import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

if (!process.env.DATABASE_URL) {
    console.error("CRITICAL: DATABASE_URL is not set in environment variables!");
}

export const { GET, POST } = toNextJsHandler(auth);
