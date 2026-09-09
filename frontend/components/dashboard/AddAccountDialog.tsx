"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Stack, TextField } from "@mui/material";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";

export default function AddAccountDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiUrl}/accounts`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, openingBalance: Number(openingBalance) }) });
    setSaving(false);
    if (!response.ok) return;
    setName("");
    setOpeningBalance("0");
    setOpen(false);
    onCreated();
  };

  return <><Button onClick={() => setOpen(true)} sx={{ minHeight: 44, px: 2, color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800 }}>Add account</Button><Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="xs"><Box component="form" onSubmit={submit}><DialogContent sx={{ pt: 3.5 }}><Stack spacing={2}><Box sx={{ color: "var(--color-ink)", fontSize: "var(--text-xl)", fontWeight: 800 }}>Add an account</Box><TextField required autoFocus label="Account name" value={name} onChange={(event) => setName(event.target.value)} /><TextField required label="Opening balance" type="number" value={openingBalance} onChange={(event) => setOpeningBalance(event.target.value)} slotProps={{ htmlInput: { step: 0.01 } }} /></Stack></DialogContent><DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="contained" disabled={saving || !name}>Save account</Button></DialogActions></Box></Dialog></>;
}
