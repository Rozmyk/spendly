import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5050/v1/auth",
  fetchOptions: {
    credentials: "include",
  },
});
