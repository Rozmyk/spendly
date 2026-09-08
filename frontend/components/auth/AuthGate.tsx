"use client";

import DashboardLayout from "../dashboard/DashboardLayout";
import { authClient } from "../../lib/auth-client";
import AuthForm from "./AuthForm";
import LoadingScreen from "../ui/LoadingScreen";

export default function AuthGate() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <AuthForm onAuthenticated={() => void refetch()} />;
  }

  return <DashboardLayout />;
}
