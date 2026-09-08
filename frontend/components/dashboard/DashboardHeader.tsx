import Link from "next/link";
import { Box, Button } from "@mui/material";

export default function DashboardHeader() {
  return <Box component="header" sx={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 4 }, borderBottom: "1px solid var(--color-rule)", bgcolor: "var(--color-paper)" }}><Box component={Link} href="/" sx={{ color: "var(--color-accent)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.06em", textDecoration: "none" }}>Spendly</Box><Button component={Link} href="/profile" sx={{ minHeight: 40, px: 1.25, color: "var(--color-ink-2)", textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "var(--color-paper-2)" } }}>Profile</Button></Box>;
}
