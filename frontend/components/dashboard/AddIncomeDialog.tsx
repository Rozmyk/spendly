"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Stack, TextField } from "@mui/material";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";

export default function AddIncomeDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiUrl}/incomes`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: Number(amount), description }) });
    setSaving(false);
    if (!response.ok) return;
    setAmount("");
    setDescription("");
    setOpen(false);
    onCreated();
  };

  return <><Button onClick={() => setOpen(true)} sx={{ minHeight: 44, px: 2, color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800 }}>Add income</Button><Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="xs"><Box component="form" onSubmit={submit}><DialogContent sx={{ pt: 3.5 }}><Stack spacing={2}><Box sx={{ color: "var(--color-ink)", fontSize: "var(--text-xl)", fontWeight: 800 }}>Record income</Box><TextField required autoFocus label="Amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }} /><TextField required label="Description" value={description} onChange={(event) => setDescription(event.target.value)} /></Stack></DialogContent><DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="contained" disabled={saving || !amount || !description}>Save income</Button></DialogActions></Box></Dialog></>;
}
