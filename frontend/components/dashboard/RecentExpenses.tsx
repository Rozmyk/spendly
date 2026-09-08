import { Box, Paper, Stack } from "@mui/material";

interface Expense { id: number; amount: number; description: string; categoryId: number; }
interface Category { id: number; name: string; }

export default function RecentExpenses({ expenses, categories }: { expenses: Expense[]; categories: Category[] }) {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  return <Box><Box component="h2" sx={{ m: 0, mb: 1.5, color: "var(--color-ink)", fontSize: "var(--text-lg)", fontWeight: 800, letterSpacing: "-0.03em" }}>Recent expenses</Box><Paper elevation={0} sx={{ border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>{expenses.length === 0 ? <Box sx={{ minHeight: 150, display: "grid", placeItems: "center", px: 3, textAlign: "center" }}><Box><Box sx={{ color: "var(--color-ink)", fontSize: "var(--text-sm)", fontWeight: 800 }}>No expenses yet</Box><Box sx={{ mt: 0.5, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>Your new entries will appear here.</Box></Box></Box> : expenses.slice(0, 5).map((expense, index) => <Stack key={expense.id} direction="row" sx={{ justifyContent: "space-between", px: { xs: 2, sm: 2.5 }, py: 1.75, borderBottom: index < Math.min(expenses.length, 5) - 1 ? "1px solid var(--color-paper-2)" : 0 }}><Box><Box sx={{ color: "var(--color-ink)", fontWeight: 800, fontSize: "var(--text-sm)" }}>{expense.description}</Box><Box sx={{ mt: 0.25, color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>{names.get(expense.categoryId) || "Uncategorized"}</Box></Box><Box sx={{ color: "var(--color-ink)", fontFamily: "var(--font-numeric)", fontWeight: 700, fontSize: "var(--text-sm)" }}>{expense.amount.toFixed(2)} PLN</Box></Stack>)}</Paper></Box>;
}
