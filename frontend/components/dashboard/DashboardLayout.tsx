"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import AddExpenseDialog from "./AddExpenseDialog";
import DashboardHeader from "./DashboardHeader";
import OverviewCards from "./OverviewCards";
import RecentExpenses from "./RecentExpenses";
import SidebarNavigation from "./SidebarNavigation";
import SpendingInsights from "./SpendingInsights";

interface Expense { id: number; amount: number; description: string; categoryId: number; createdAt: string; }
interface Category { id: number; name: string; }
interface DashboardLayoutProps { user: { name: string; email: string; image?: string | null }; }
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";

export default function DashboardLayout({ user }: DashboardLayoutProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const refresh = useCallback(() => { fetch(`${apiUrl}/expenses`, { credentials: "include" }).then((response) => response.ok ? response.json() : []).then(setExpenses).catch(() => setExpenses([])); }, []);
  useEffect(() => { refresh(); fetch(`${apiUrl}/categories`, { credentials: "include" }).then((response) => response.ok ? response.json() : []).then(setCategories).catch(() => setCategories([])); }, [refresh]);
  return <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}><DashboardHeader user={user} /><Box sx={{ display: "flex", minHeight: "calc(100vh - 76px)" }}><SidebarNavigation /><Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 4 } }}><Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 1280, mx: "auto" }}><Paper elevation={0} sx={{ position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(260px, 0.9fr)" }, minHeight: { md: 246 }, borderRadius: "var(--radius-lg)", bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)" }}><Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 4.5 } }}><Box sx={{ fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em", opacity: 0.8 }}>SPENDLY OVERVIEW</Box><Box component="h1" sx={{ maxWidth: 470, m: 0, mt: 2, fontSize: { xs: "2.2rem", md: "3.2rem" }, lineHeight: 1.03, fontWeight: 800, letterSpacing: "-0.06em" }}>Keep your money moving in the right direction.</Box><Box sx={{ mt: 3 }}><AddExpenseDialog onCreated={refresh} /></Box></Box><Box sx={{ position: "relative", minHeight: { xs: 160, md: "auto" }, bgcolor: "var(--color-violet)", borderRadius: { xs: "48% 0 0 0", md: "56% 0 0 56%" }, transform: { xs: "translate(25%, 25%)", md: "translate(10%, -16%) rotate(-9deg)" } }} /></Paper><OverviewCards expenses={expenses} /><SpendingInsights expenses={expenses} categories={categories} /><RecentExpenses expenses={expenses} categories={categories} /></Stack></Box></Box></Box>;
}
