import { Box, Button, Divider, Stack } from "@mui/material";

const navigation = ["Overview", "Expenses", "Analytics", "Budgets", "Settings"];

export default function SidebarNavigation() {
  return <Box component="nav" aria-label="Main navigation" sx={{ width: 224, flexShrink: 0, display: { xs: "none", md: "block" }, bgcolor: "var(--color-paper)", borderRight: "1px solid var(--color-rule)", px: 2, py: 3 }}><Box sx={{ px: 1.25, color: "var(--color-muted)", fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em" }}>WORKSPACE</Box><Divider sx={{ my: 1.75, borderColor: "var(--color-rule)" }} /><Stack spacing={0.5}>{navigation.map((label, index) => <Button key={label} variant="text" sx={{ justifyContent: "flex-start", minHeight: 42, px: 1.25, borderRadius: "var(--radius-sm)", color: index === 0 ? "var(--color-accent-ink)" : "var(--color-ink-2)", bgcolor: index === 0 ? "var(--color-accent)" : "transparent", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: index === 0 ? 800 : 700, "&:hover": { bgcolor: index === 0 ? "var(--color-accent)" : "var(--color-paper-2)" } }}>{label}</Button>)}</Stack></Box>;
}
