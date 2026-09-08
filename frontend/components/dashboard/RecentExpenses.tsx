import { Box, Paper } from "@mui/material";

export default function RecentExpenses() {
  return <Box><Box component="h2" sx={{ m: 0, mb: 1.5, color: "var(--color-ink)", fontSize: "var(--text-lg)", fontWeight: 800, letterSpacing: "-0.03em" }}>Recent expenses</Box><Paper elevation={0} sx={{ minHeight: 150, display: "grid", placeItems: "center", px: 3, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)", textAlign: "center" }}><Box><Box sx={{ color: "var(--color-ink)", fontSize: "var(--text-sm)", fontWeight: 800 }}>No expenses yet</Box><Box sx={{ mt: 0.5, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>New transactions will appear here.</Box></Box></Paper></Box>;
}
