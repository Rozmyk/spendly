"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Stack } from "@mui/material";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "../../lib/auth-client";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNavigation from "../dashboard/SidebarNavigation";
import { CategoryIcon } from "../ui/CategoryIcon";
import LoadingScreen from "../ui/LoadingScreen";

interface Expense {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  createdAt: string;
}
interface Category {
  id: number;
  name: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";
const chartColors = ["#2576df", "#9b6ee8", "#4b9a76", "#c68125", "#d05f79"];
const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
    if (!session) return;
    refresh();
    fetch(`${apiUrl}/categories`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [refresh, session]);

  const analytics = useMemo(() => {
    const categoryNames = new Map(
      categories.map((category) => [category.id, category.name])
    );
    const categoryTotals = new Map<number, number>();
    expenses.forEach((expense) =>
      categoryTotals.set(
        expense.categoryId,
        (categoryTotals.get(expense.categoryId) || 0) + expense.amount
      )
    );
    const byCategory = [...categoryTotals.entries()]
      .map(([id, amount]) => ({
        name: categoryNames.get(id) || "Uncategorized",
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + index);
      return date;
    });
    const totalsByDay = new Map<string, number>();
    expenses.forEach((expense) => {
      const key = dayKey(new Date(expense.createdAt));
      totalsByDay.set(key, (totalsByDay.get(key) || 0) + expense.amount);
    });
    const weekly = days.map((date) => ({
      label: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
        date
      ),
      amount: totalsByDay.get(dayKey(date)) || 0,
    }));
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { byCategory, weekly, total, topCategory: byCategory[0] };
  }, [categories, expenses]);

  if (isPending || !session)
    return <LoadingScreen label="Preparing your analytics" />;

  const chartTooltip = {
    contentStyle: {
      border: "1px solid var(--color-rule)",
      borderRadius: "8px",
      boxShadow: "none",
      fontFamily: "var(--font-body)",
    },
    formatter: (value: unknown) => money.format(Number(value)),
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}>
      <DashboardHeader />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 76px)" }}>
        <SidebarNavigation />
        <Box
          component="main"
          className="workspace-content"
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
                SPENDING PATTERNS
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
                See where your money goes.
              </Box>
              <Box
                sx={{
                  mt: 1,
                  color: "var(--color-muted)",
                  fontSize: "var(--text-sm)",
                }}
              >
                A simple read on the expenses you have recorded.
              </Box>
            </Box>
            {expenses.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  display: "grid",
                  minHeight: 330,
                  placeItems: "center",
                  border: "1px solid var(--color-rule)",
                  borderRadius: "var(--radius-lg)",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      color: "var(--color-ink)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 800,
                    }}
                  >
                    Your charts will appear here.
                  </Box>
                  <Box
                    sx={{
                      mt: 0.75,
                      color: "var(--color-muted)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    Add expenses to start seeing useful patterns.
                  </Box>
                </Box>
              </Paper>
            ) : (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
                  <Metric
                    label="Total recorded"
                    value={money.format(analytics.total)}
                  />
                  <Metric label="Entries" value={String(expenses.length)} />
                  <Metric
                    label="Top category"
                    value={analytics.topCategory?.name || "—"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      lg: "minmax(0, 1.35fr) minmax(300px, 0.65fr)",
                    },
                    gap: 3,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      border: "1px solid var(--color-rule)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <ChartHeading title="Last 7 days" detail="Daily spending" />
                    <Box sx={{ height: 280, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.weekly}
                          margin={{ top: 8, right: 0, left: -18, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                            tickFormatter={(value) => `${value} zł`}
                            width={48}
                          />
                          <Tooltip
                            {...chartTooltip}
                            cursor={{ fill: "#eef3f9" }}
                          />
                          <Bar
                            dataKey="amount"
                            fill="#2576df"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={42}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      border: "1px solid var(--color-rule)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <ChartHeading title="By category" detail="Share of total" />
                    <Box sx={{ height: 210, mt: 1.5 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.byCategory}
                            dataKey="amount"
                            nameKey="name"
                            innerRadius="57%"
                            outerRadius="82%"
                            paddingAngle={3}
                          >
                            {analytics.byCategory.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={chartColors[index % chartColors.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip {...chartTooltip} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {analytics.byCategory.slice(0, 4).map((item, index) => (
                        <Box
                          key={item.name}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            fontSize: "var(--text-xs)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                              color: "var(--color-ink-2)",
                              fontWeight: 700,
                            }}
                          >
                            <CategoryIcon name={item.name} size={20} />
                            {item.name}
                          </Box>
                          <Box
                            sx={{
                              color: "var(--color-ink)",
                              fontFamily: "var(--font-numeric)",
                              fontWeight: 700,
                            }}
                          >
                            {money.format(item.amount)}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid var(--color-rule)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <Box
        sx={{
          color: "var(--color-muted)",
          fontSize: "var(--text-xs)",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          mt: 0.75,
          color: "var(--color-ink)",
          fontSize: "var(--text-xl)",
          fontWeight: 800,
          letterSpacing: "-0.045em",
        }}
      >
        {value}
      </Box>
    </Paper>
  );
}

function ChartHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <Box>
      <Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>{title}</Box>
      <Box
        sx={{
          mt: 0.25,
          color: "var(--color-muted)",
          fontSize: "var(--text-xs)",
        }}
      >
        {detail}
      </Box>
    </Box>
  );
}
