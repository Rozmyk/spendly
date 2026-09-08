import { Badge, Box, IconButton } from "@mui/material";

export default function DashboardHeader() {
  return <Box component="header" sx={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 4 }, borderBottom: "1px solid var(--color-rule)", bgcolor: "var(--color-paper)" }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "var(--color-accent)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.06em" }}><Box sx={{ width: 31, height: 31, display: "grid", placeItems: "center", border: "3px solid var(--color-accent)", borderRadius: "50%", fontSize: "0.9rem" }}>S</Box>Spendly</Box><IconButton aria-label="Notifications" sx={{ width: 40, height: 40, color: "var(--color-ink-2)", border: "1px solid var(--color-rule)", borderRadius: "50%" }}><Badge variant="dot" color="error"><Box component="span" sx={{ fontSize: "0.8rem" }}>●</Box></Badge></IconButton></Box>;
}
