import { useMemo } from "react";
import Link from "next/link";
import { Avatar, Badge, Box, Button, IconButton, Stack } from "@mui/material";

interface DashboardHeaderProps {
  user: { name: string; email: string; image?: string | null };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = useMemo(() => user.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S", [user.name]);
  return <Box component="header" sx={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 4 }, borderBottom: "1px solid var(--color-rule)", bgcolor: "var(--color-paper)" }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "var(--color-accent)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.06em" }}><Box sx={{ width: 31, height: 31, display: "grid", placeItems: "center", border: "3px solid var(--color-accent)", borderRadius: "50%", fontSize: "0.9rem" }}>S</Box>Spendly</Box><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><IconButton aria-label="Notifications" sx={{ width: 40, height: 40, color: "var(--color-ink-2)", border: "1px solid var(--color-rule)", borderRadius: "50%" }}><Badge variant="dot" color="error"><Box component="span" sx={{ fontSize: "0.8rem" }}>●</Box></Badge></IconButton><Button component={Link} href="/profile" aria-label="Open profile" sx={{ minWidth: 0, p: 0.5, borderRadius: "50%" }}><Avatar src={user.image || undefined} sx={{ width: 34, height: 34, bgcolor: "var(--color-paper-2)", color: "var(--color-ink)", fontSize: "var(--text-sm)", fontWeight: 800, border: "1px solid var(--color-rule)" }}>{initials}</Avatar></Button></Stack></Box>;
}
