"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { authClient } from "../../lib/auth-client";
import AppButton from "../ui/AppButton";

export default function DashboardHeader() {
  const router = useRouter();
  const signOut = async () => { await authClient.signOut(); router.replace("/"); };

  return <Box component="header" sx={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 4 }, borderBottom: "1px solid var(--color-rule)", bgcolor: "var(--color-paper)" }}><Box component={Link} href="/" sx={{ color: "var(--color-accent)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.06em", textDecoration: "none" }}>Spendly</Box><AppButton tone="neutral" type="button" onClick={() => void signOut()} sx={{ minHeight: 40, px: 1.5 }}>Sign out</AppButton></Box>;
}
