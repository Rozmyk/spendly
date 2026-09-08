import { Box, Paper } from "@mui/material";

const summaries = ["Balance", "Expenses", "Income"];

export default function OverviewCards() {
  return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1.5 }}>{summaries.map((label) => <Paper key={label} elevation={0} sx={{ minHeight: 132, p: 2.25, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)", bgcolor: "var(--color-paper)" }}><Box sx={{ color: "var(--color-muted)", fontSize: "var(--text-sm)", fontWeight: 700 }}>{label}</Box><Box sx={{ mt: 3.5, color: "var(--color-ink)", fontFamily: "var(--font-numeric)", fontSize: "1.35rem", fontWeight: 500, letterSpacing: "-0.05em" }}>—</Box><Box sx={{ mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>No data yet</Box></Paper>)}</Box>;
}
