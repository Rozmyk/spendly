"use client";

import { useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

export default function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (!loading) {
      setOpen(false);
      setError("");
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1"}/expenses`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: Number(amount), description, categoryId: Number(categoryId) }) });
    setLoading(false);

    if (!response.ok) {
      setError("Unable to save this expense. Check the entered values.");
      return;
    }

    setAmount("");
    setDescription("");
    setCategoryId("");
    setOpen(false);
  };

  return <><Button variant="contained" onClick={() => setOpen(true)} sx={{ minHeight: 42, px: 2, borderRadius: "var(--radius-sm)", bgcolor: "var(--color-paper)", color: "var(--color-accent)", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "var(--color-paper)", boxShadow: "none" } }}>Add expense</Button><Dialog open={open} onClose={close} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: "var(--radius-md)" } } }}><Box component="form" onSubmit={submit}><DialogTitle sx={{ color: "var(--color-ink)", fontWeight: 800 }}>Add expense</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{error && <Alert severity="error">{error}</Alert>}<TextField required autoFocus label="Amount" type="number" slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }} value={amount} onChange={(event) => setAmount(event.target.value)} /><TextField required label="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><TextField required label="Category ID" type="number" slotProps={{ htmlInput: { min: 1, step: 1 } }} value={categoryId} onChange={(event) => setCategoryId(event.target.value)} helperText="Use an existing category identifier." /></Stack></DialogContent><DialogActions sx={{ px: 3, pb: 2.5 }}><Button type="button" onClick={close} disabled={loading} sx={{ color: "var(--color-ink-2)", textTransform: "none", fontWeight: 700 }}>Cancel</Button><Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "var(--color-accent)", boxShadow: "none" } }}>{loading ? "Saving" : "Save expense"}</Button></DialogActions></Box></Dialog></>;
}
