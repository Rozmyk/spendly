"use client";

import { Box, CircularProgress } from "@mui/material";
import DashboardLayout from "../dashboard/DashboardLayout";
import { authClient } from "../../lib/auth-client";
import AuthForm from "./AuthForm";

export default function AuthGate() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending) {
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "var(--color-paper)" }}><CircularProgress size={28} sx={{ color: "var(--color-accent)" }} /></Box>;
  }

  if (!session) {
    return <AuthForm onAuthenticated={() => void refetch()} />;
  }

  return <DashboardLayout />;
}
