import { Box, Paper } from "@mui/material";

interface Expense { amount: number; }
interface FinancialSummary { openingBalance: number; totalIncome: number; totalExpenses: number; balance: number; }

export default function OverviewCards({ expenses, summary }: { expenses: Expense[]; summary: FinancialSummary | null }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const summaries = [{ label: "Balance", value: summary ? `${summary.balance.toFixed(2)} PLN` : "—", detail: summary ? `Opening balance ${summary.openingBalance.toFixed(2)} PLN` : "Loading your cashflow" }, { label: "Expenses", value: `${(summary?.totalExpenses ?? total).toFixed(2)} PLN`, detail: `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}` }, { label: "Income", value: summary ? `${summary.totalIncome.toFixed(2)} PLN` : "—", detail: "All recorded income" }];
  return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1.5 }}>{summaries.map((item) => <Paper key={item.label} elevation={0} sx={{ minHeight: 132, p: 2.25, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)", bgcolor: "var(--color-paper)" }}><Box sx={{ color: "var(--color-muted)", fontSize: "var(--text-sm)", fontWeight: 700 }}>{item.label}</Box><Box sx={{ mt: 3.5, color: "var(--color-ink)", fontFamily: "var(--font-numeric)", fontSize: "1.35rem", fontWeight: 600, letterSpacing: "-0.05em" }}>{item.value}</Box><Box sx={{ mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>{item.detail}</Box></Paper>)}</Box>;
}
