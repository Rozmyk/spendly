import { Box, Stack } from "@mui/material";

import DashboardHeader from "./DashboardHeader";
import OverviewCards from "./OverviewCards";
import RecentExpenses from "./RecentExpenses";
import SidebarNavigation from "./SidebarNavigation";
import SpendingInsights from "./SpendingInsights";

export default function DashboardLayout() {
  return <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}><DashboardHeader /><Box sx={{ display: "flex", minHeight: "calc(100vh - 68px)" }}><SidebarNavigation /><Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 5 } }}><Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 1280, mx: "auto" }}><Box><Box component="h1" sx={{ m: 0, color: "var(--color-ink)", fontSize: { xs: "var(--text-2xl)", md: "2.25rem" }, fontWeight: 750, letterSpacing: "-0.04em" }}>Overview</Box><Box component="p" sx={{ m: 0, mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-lg)" }}>A clear view of your finances.</Box></Box><OverviewCards /><SpendingInsights /><RecentExpenses /></Stack></Box></Box></Box>;
}
