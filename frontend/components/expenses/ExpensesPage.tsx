"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Paper, Stack } from "@mui/material";
import { authClient } from "../../lib/auth-client";
import AddExpenseDialog from "../dashboard/AddExpenseDialog";
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
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ExpensesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

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

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );
  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const exportCsv = async () => {
    setExporting(true);
    const response = await fetch(`${apiUrl}/expenses/export`, { credentials: "include" });
    setExporting(false);
    if (!response.ok) return setImportMessage("Unable to export expenses right now.");
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = "spendly-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    setImportMessage("Uploading CSV…");
    const data = new FormData();
    data.append("file", file);
    const response = await fetch(`${apiUrl}/imports/expenses`, { method: "POST", credentials: "include", body: data });
    if (!response.ok) {
      setImporting(false);
      return setImportMessage("CSV import could not be started. Check the file format.");
    }
    const job = await response.json() as { id: string };
    const poll = async () => {
      const status = await fetch(`${apiUrl}/imports/expenses/${job.id}`, { credentials: "include" });
      if (!status.ok) {
        setImporting(false);
        return setImportMessage("CSV import could not be completed.");
      }
      const result = await status.json() as { status: string; importedRows: number; skippedRows: number; errorMessage?: string };
      if (result.status === "queued" || result.status === "processing") return window.setTimeout(poll, 700);
      setImporting(false);
      if (result.status === "completed") {
        setImportMessage(`Imported ${result.importedRows} expenses${result.skippedRows ? `, skipped ${result.skippedRows}` : ""}.`);
        refresh();
      } else setImportMessage(result.errorMessage || "CSV import failed.");
    };
    void poll();
  };

  if (isPending || !session)
    return <LoadingScreen label="Opening your expenses" />;

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
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Box
                  sx={{
                    color: "var(--color-accent)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                  }}
                >
                  SPENDING LOG
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
                  Every expense, in one place.
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    color: "var(--color-muted)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {expenses.length}{" "}
                  {expenses.length === 1 ? "entry" : "entries"} ·{" "}
                  {total.toFixed(2)} PLN recorded
                </Box>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={importCsv} />
                <Button onClick={() => fileInput.current?.click()} disabled={importing} sx={{ minHeight: 44, px: 2, color: "var(--color-ink-2)", textTransform: "none", fontWeight: 800 }}>{importing ? "Importing…" : "Import CSV"}</Button>
                <Button onClick={() => void exportCsv()} disabled={exporting || expenses.length === 0} sx={{ minHeight: 44, px: 2, color: "var(--color-ink-2)", textTransform: "none", fontWeight: 800 }}>{exporting ? "Exporting…" : "Export CSV"}</Button>
                <AddExpenseDialog onCreated={refresh} />
              </Stack>
            </Box>
            {importMessage && <Alert severity={importMessage.includes("could not") || importMessage.includes("failed") ? "error" : "success"} onClose={() => setImportMessage("")}>{importMessage}</Alert>}
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                border: "1px solid var(--color-rule)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              {expenses.length === 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    minHeight: 300,
                    placeItems: "center",
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
                      Nothing recorded yet.
                    </Box>
                    <Box
                      sx={{
                        mt: 0.75,
                        color: "var(--color-muted)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      Add your first expense to start building a clear picture.
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {expenses.map((expense, index) => (
                    <Box
                      component="li"
                      key={expense.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr auto",
                          sm: "minmax(0, 1fr) 9rem 8rem",
                        },
                        gap: { xs: 0.5, sm: 2 },
                        alignItems: "center",
                        px: { xs: 2, sm: 3 },
                        py: 2.25,
                        borderBottom:
                          index < expenses.length - 1
                            ? "1px solid var(--color-paper-2)"
                            : 0,
                      }}
                    >
                      <Box>
                        <Box
                          sx={{ color: "var(--color-ink)", fontWeight: 800 }}
                        >
                          {expense.description}
                        </Box>
                        <Box
                          sx={{
                            display: { xs: "flex", sm: "none" },
                            alignItems: "center",
                            gap: 0.6,
                            mt: 0.5,
                            color: "var(--color-muted)",
                            fontSize: "var(--text-xs)",
                          }}
                        >
                          <CategoryIcon
                            name={
                              categoryNames.get(expense.categoryId) ||
                              "Uncategorized"
                            }
                            size={18}
                          />
                          {categoryNames.get(expense.categoryId) ||
                            "Uncategorized"}{" "}
                          · {dateFormatter.format(new Date(expense.createdAt))}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          alignItems: "center",
                          gap: 0.75,
                          color: "var(--color-ink-2)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 700,
                        }}
                      >
                        <CategoryIcon
                          name={
                            categoryNames.get(expense.categoryId) ||
                            "Uncategorized"
                          }
                          size={22}
                        />
                        {categoryNames.get(expense.categoryId) ||
                          "Uncategorized"}
                      </Box>
                      <Box
                        sx={{
                          color: "var(--color-ink)",
                          fontFamily: "var(--font-numeric)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {expense.amount.toFixed(2)} PLN
                        <Box
                          component="span"
                          sx={{
                            display: { xs: "none", sm: "block" },
                            mt: 0.35,
                            color: "var(--color-muted)",
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                          }}
                        >
                          {dateFormatter.format(new Date(expense.createdAt))}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
