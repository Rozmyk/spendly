"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, Stack, TextField } from "@mui/material";
import { authClient } from "../../lib/auth-client";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNavigation from "../dashboard/SidebarNavigation";
import LoadingScreen from "../ui/LoadingScreen";

interface Expense {
  amount: number;
  categoryId: number;
  createdAt: string;
}
interface Category {
  id: number;
  name: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";
const storageKey = "spendly-monthly-budget";
const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

export default function BudgetsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState(3000);
  const [draft, setDraft] = useState("3000");
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(() => {
    fetch(`${apiUrl}/expenses`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then(setExpenses)
      .catch(() => setExpenses([]));
  }, []);

  useEffect(() => {
    if (!isPending && !session) router.replace("/");
  }, [isPending, router, session]);
  useEffect(() => {
    const storedBudget = window.localStorage.getItem(storageKey);
    if (storedBudget && Number(storedBudget) > 0) {
      setBudget(Number(storedBudget));
      setDraft(storedBudget);
    }
  }, []);
  useEffect(() => {
    if (!session) return;
    refresh();
    fetch(`${apiUrl}/categories`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [refresh, session]);

  const currentMonth = new Date();
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const date = new Date(expense.createdAt);
        return (
          date.getFullYear() === currentMonth.getFullYear() &&
          date.getMonth() === currentMonth.getMonth()
        );
      }),
    [expenses, currentMonth]
  );
  const spent = useMemo(
    () => monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [monthlyExpenses]
  );
  const categorySpend = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          monthlyExpenses
            .filter((expense) => expense.categoryId === category.id)
            .reduce((sum, expense) => sum + expense.amount, 0),
        ])
      ),
    [categories, monthlyExpenses]
  );
  const remaining = budget - spent;
  const percentage = budget ? Math.min(100, (spent / budget) * 100) : 0;
  const categoryAllowance = categories.length ? budget / categories.length : 0;

  if (isPending || !session)
    return <LoadingScreen label="Opening your budgets" />;

  const saveBudget = () => {
    const nextBudget = Number(draft);
    if (!Number.isFinite(nextBudget) || nextBudget <= 0) return;
    setBudget(nextBudget);
    window.localStorage.setItem(storageKey, String(nextBudget));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}>
      <DashboardHeader />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 76px)" }}>
        <SidebarNavigation />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 2, sm: 3, lg: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 1120, mx: "auto" }}>
            <Box>
              <Box
                sx={{
                  color: "var(--color-accent)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                MONTHLY PLAN
              </Box>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  mt: 0.75,
                  color: "var(--color-ink)",
                  fontSize: { xs: "var(--text-2xl)", md: "2.6rem" },
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                }}
              >
                Give your money a job.
              </Box>
              <Box
                sx={{
                  mt: 1,
                  color: "var(--color-muted)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Set a monthly ceiling and keep an eye on your pace.
              </Box>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "var(--radius-lg)",
                bgcolor: "var(--color-accent)",
                color: "var(--color-accent-ink)",
              }}
            >
              <Box
                sx={{
                  maxWidth: 620,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      opacity: 0.8,
                    }}
                  >
                    THIS MONTH
                  </Box>
                  <Box
                    sx={{
                      mt: 1.25,
                      fontFamily: "var(--font-numeric)",
                      fontSize: { xs: "2.4rem", sm: "3.4rem" },
                      fontWeight: 700,
                      letterSpacing: "-0.08em",
                    }}
                  >
                    {money.format(Math.abs(remaining))}
                  </Box>
                  <Box
                    sx={{
                      mt: 0.25,
                      fontSize: "var(--text-sm)",
                      fontWeight: 700,
                      opacity: 0.85,
                    }}
                  >
                    {remaining >= 0
                      ? "left to spend"
                      : "over your monthly limit"}
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      mt: 3,
                      maxWidth: 540,
                      overflow: "hidden",
                      borderRadius: 99,
                      bgcolor: "oklch(99% 0.003 250 / 0.24)",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${percentage}%`,
                        height: "100%",
                        borderRadius: 99,
                        bgcolor:
                          remaining < 0
                            ? "var(--color-violet)"
                            : "var(--color-accent-ink)",
                        transition: "width var(--dur-medium) var(--ease-out)",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{ mt: 0.75, fontSize: "var(--text-xs)", opacity: 0.8 }}
                  >
                    {money.format(spent)} of {money.format(budget)} spent
                  </Box>
                </Box>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                p: { xs: 2.5, sm: 3 },
                border: "1px solid var(--color-rule)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Box>
                <Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>
                  Monthly limit
                </Box>
                <Box
                  sx={{
                    mt: 0.4,
                    color: "var(--color-muted)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  Change the spending ceiling for this device.
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: { xs: "100%", sm: 300 },
                  flexShrink: 0,
                }}
              >
                <TextField
                  aria-label="Monthly limit in PLN"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  type="number"
                  fullWidth
                  slotProps={{
                    htmlInput: { min: 1, step: 50 },
                    input: {
                      endAdornment: (
                        <Box
                          sx={{
                            color: "var(--color-muted)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 800,
                          }}
                        >
                          PLN
                        </Box>
                      ),
                    },
                  }}
                />
                <Button
                  onClick={saveBudget}
                  variant="contained"
                  sx={{
                    minWidth: 84,
                    bgcolor: "var(--color-accent)",
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "var(--color-accent)",
                      boxShadow: "none",
                    },
                  }}
                >
                  {saved ? "Saved" : "Save"}
                </Button>
              </Box>
            </Paper>
            <Box>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  mb: 1.5,
                  color: "var(--color-ink)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Category pace
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {categories.length ? (
                  categories.map((category) => (
                    <CategoryBudget
                      key={category.id}
                      name={category.name}
                      spent={categorySpend.get(category.id) || 0}
                      allowance={categoryAllowance}
                    />
                  ))
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      gridColumn: "1 / -1",
                      p: 4,
                      border: "1px dashed var(--color-rule)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--color-muted)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    Categories will appear here when they are available.
                  </Paper>
                )}
              </Box>
              <Box
                sx={{
                  mt: 1.5,
                  color: "var(--color-muted)",
                  fontSize: "var(--text-xs)",
                }}
              >
                Your monthly limit is stored on this device. Category pace
                splits it evenly across your available categories.
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function CategoryBudget({
  name,
  spent,
  allowance,
}: {
  name: string;
  spent: number;
  allowance: number;
}) {
  const percentage = allowance ? Math.min(100, (spent / allowance) * 100) : 0;
  const over = spent > allowance;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid var(--color-rule)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>{name}</Box>
        <Box
          sx={{
            color: over ? "var(--color-error)" : "var(--color-ink-2)",
            fontFamily: "var(--font-numeric)",
            fontSize: "var(--text-sm)",
            fontWeight: 700,
          }}
        >
          {money.format(spent)}
        </Box>
      </Box>
      <Box
        sx={{
          height: 7,
          mt: 1.5,
          overflow: "hidden",
          borderRadius: 99,
          bgcolor: "var(--color-paper-2)",
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: 99,
            bgcolor: over ? "var(--color-error)" : "var(--color-accent)",
          }}
        />
      </Box>
      <Box
        sx={{
          mt: 0.75,
          color: "var(--color-muted)",
          fontSize: "var(--text-xs)",
        }}
      >
        {money.format(allowance)} suggested allowance
      </Box>
    </Paper>
  );
}
