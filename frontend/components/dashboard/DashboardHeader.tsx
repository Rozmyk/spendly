import { Badge, Box, IconButton } from "@mui/material";

export default function DashboardHeader() {
  return <Box component="header" sx={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 4 }, borderBottom: "1px solid var(--color-rule)", bgcolor: "var(--color-paper)" }}><Box sx={{ color: "var(--color-ink)", fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Spendly</Box><IconButton aria-label="Powiadomienia" sx={{ width: 36, height: 36, color: "var(--color-ink-2)", border: "1px solid var(--color-rule)", borderRadius: "var(--radius-sm)" }}><Badge variant="dot" color="error"><Box component="span" sx={{ fontSize: "0.9rem" }}>●</Box></Badge></IconButton></Box>;
}
