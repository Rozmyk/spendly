"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { CategoryIcon } from "../ui/CategoryIcon";

interface Category {
  id: number;
  name: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/v1";

interface AddExpenseDialogProps {
  onCreated?: () => void;
}

export default function AddExpenseDialog({ onCreated }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/categories`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Category[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

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
    const response = await fetch(`${apiUrl}/expenses`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({
        amount: Number(amount),
        description,
        categoryId: Number(categoryId),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Unable to save this expense. Check the entered values.");
      return;
    }
    setAmount("");
    setDescription("");
    setCategoryId("");
    setOpen(false);
    onCreated?.();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          minHeight: 44,
          px: 2.25,
          borderRadius: "var(--radius-sm)",
          bgcolor: "var(--color-paper)",
          color: "var(--color-accent)",
          textTransform: "none",
          fontSize: "var(--text-sm)",
          fontWeight: 800,
          boxShadow: "none",
          "&:hover": { bgcolor: "var(--color-paper)", boxShadow: "none" },
        }}
      >
        Add an expense
      </Button>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { overflow: "hidden", borderRadius: "var(--radius-lg)" },
          },
        }}
      >
        <Box component="form" onSubmit={submit}>
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              bgcolor: "var(--color-accent)",
              color: "var(--color-accent-ink)",
            }}
          >
            <Box
              sx={{
                fontSize: "var(--text-xs)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                opacity: 0.82,
              }}
            >
              NEW ENTRY
            </Box>
            <Box
              component="h2"
              sx={{
                m: 0,
                mt: 1,
                fontSize: { xs: "var(--text-xl)", sm: "1.9rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              What did you spend?
            </Box>
            <Box
              sx={{
                mt: 1,
                maxWidth: 360,
                fontSize: "var(--text-sm)",
                lineHeight: 1.55,
                opacity: 0.86,
              }}
            >
              Capture the detail now. You can review it with the rest of your
              spending later.
            </Box>
          </Box>
          <DialogContent sx={{ px: { xs: 3, sm: 4 }, py: 3.5 }}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}
              <Box>
                <Box
                  sx={{
                    mb: 1,
                    color: "var(--color-ink-2)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 800,
                  }}
                >
                  Amount
                </Box>
                <TextField
                  required
                  autoFocus
                  fullWidth
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  slotProps={{
                    htmlInput: { min: 0.01, step: 0.01 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">PLN</InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& input": {
                      py: 1.6,
                      fontFamily: "var(--font-numeric)",
                      fontSize: "1.65rem",
                      fontWeight: 600,
                      letterSpacing: "-0.06em",
                    },
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: "var(--color-rule)" }} />
              <TextField
                required
                fullWidth
                label="What was it for?"
                placeholder="e.g. Weekly groceries"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <TextField
                required
                select
                fullWidth
                label="Category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={categories.length === 0}
                helperText={
                  categories.length === 0
                    ? "Categories are unavailable."
                    : "Choose the category that fits best."
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CategoryIcon name={category.name} size={22} />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 3, sm: 4 }, pb: 3.5, gap: 1 }}>
            <Button
              type="button"
              onClick={close}
              disabled={loading}
              sx={{
                color: "var(--color-ink-2)",
                textTransform: "none",
                fontWeight: 750,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !categoryId}
              sx={{
                minHeight: 42,
                px: 2.25,
                bgcolor: "var(--color-accent)",
                color: "var(--color-accent-ink)",
                textTransform: "none",
                fontWeight: 800,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "var(--color-accent)",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Saving" : "Save expense"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
