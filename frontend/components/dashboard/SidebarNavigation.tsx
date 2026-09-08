import { Box, Button, Stack } from "@mui/material";

const navigation = ["Overview", "Expenses", "Analytics", "Budgets", "Settings"];

export default function SidebarNavigation() {
  return <Box component="nav" aria-label="Główna nawigacja" sx={{ width: 208, flexShrink: 0, display: { xs: "none", md: "block" }, borderRight: "1px solid var(--color-rule)", px: 2, py: 3 }}><Stack spacing={0.5}>{navigation.map((label, index) => <Button key={label} variant="text" sx={{ position: "relative", justifyContent: "flex-start", minHeight: 42, px: 1.25, borderRadius: "var(--radius-sm)", color: index === 0 ? "var(--color-ink)" : "var(--color-muted)", bgcolor: index === 0 ? "var(--color-paper-2)" : "transparent", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: index === 0 ? 800 : 600, "&::before": { content: '""', position: "absolute", left: -8, top: 11, bottom: 11, width: 2, borderRadius: 3, bgcolor: index === 0 ? "var(--color-accent)" : "transparent" }, "&:hover": { bgcolor: "var(--color-paper-2)" } }}>{label}</Button>)}</Stack></Box>;
}
