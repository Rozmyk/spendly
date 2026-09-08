import { Box, Paper } from "@mui/material";

interface Expense { amount: number; }

export default function OverviewCards({ expenses }: { expenses: Expense[] }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const summaries = [{ label: "Balance", value: "—", detail: "Add income to calculate balance" }, { label: "Expenses", value: `${total.toFixed(2)} PLN`, detail: `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}` }, { label: "Income", value: "—", detail: "Income tracking is coming next" }];
  return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1.5 }}>{summaries.map((item) => <Paper key={item.label} elevation={0} sx={{ minHeight: 132, p: 2.25, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)", bgcolor: "var(--color-paper)" }}><Box sx={{ color: "var(--color-muted)", fontSize: "var(--text-sm)", fontWeight: 700 }}>{item.label}</Box><Box sx={{ mt: 3.5, color: "var(--color-ink)", fontFamily: "var(--font-numeric)", fontSize: "1.35rem", fontWeight: 600, letterSpacing: "-0.05em" }}>{item.value}</Box><Box sx={{ mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>{item.detail}</Box></Paper>)}</Box>;
}
