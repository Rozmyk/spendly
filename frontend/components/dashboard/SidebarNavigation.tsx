"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button, Divider, Stack } from "@mui/material";

const workspaceNavigation = [{ label: "Overview", href: "/" }, { label: "Expenses", href: "/expenses" }, { label: "Analytics", href: "/analytics" }, { label: "Budgets", href: "/budgets" }, { label: "Settings", href: "/settings" }];

export default function SidebarNavigation() {
  const pathname = usePathname();
  const itemSx = (active: boolean) => ({ justifyContent: "flex-start", minHeight: 42, px: 1.25, borderRadius: "var(--radius-sm)", color: active ? "var(--color-accent-ink)" : "var(--color-ink-2)", bgcolor: active ? "var(--color-accent)" : "transparent", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: active ? 800 : 700, transition: "background-color 180ms var(--ease-out), color 180ms var(--ease-out), transform 180ms var(--ease-out)", "&:hover": { bgcolor: active ? "var(--color-accent)" : "var(--color-paper-2)", transform: "translateX(3px)" } });

  return <Box component="nav" aria-label="Main navigation" sx={{ width: 224, flexShrink: 0, display: { xs: "none", md: "flex" }, flexDirection: "column", bgcolor: "var(--color-paper)", borderRight: "1px solid var(--color-rule)", px: 2, py: 3 }}><Box sx={{ px: 1.25, color: "var(--color-muted)", fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em" }}>WORKSPACE</Box><Divider sx={{ my: 1.75, borderColor: "var(--color-rule)" }} /><Stack spacing={0.5}>{workspaceNavigation.map((item) => { const active = item.href === pathname; return item.href ? <Button key={item.label} component={Link} href={item.href} aria-current={active ? "page" : undefined} sx={itemSx(active)}>{item.label}</Button> : <Button key={item.label} variant="text" sx={itemSx(false)}>{item.label}</Button>; })}</Stack><Box sx={{ mt: "auto", pt: 2.5 }}><Divider sx={{ mb: 2.5, borderColor: "var(--color-rule)" }} /><Box sx={{ px: 1.25, color: "var(--color-muted)", fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em" }}>ACCOUNT</Box><Stack spacing={0.5} sx={{ mt: 1.25 }}><Button component={Link} href="/profile" aria-current={pathname === "/profile" ? "page" : undefined} sx={itemSx(pathname === "/profile")}>Profile</Button></Stack></Box></Box>;
}
