"use client";

import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField } from "@mui/material";
import { authClient } from "../../lib/auth-client";

type AuthMode = "login" | "register";

interface AuthFormProps {
  onAuthenticated: () => void;
}

export default function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = isRegister
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Unable to continue. Please try again.");
      return;
    }

    onAuthenticated();
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  return <Box component="main" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 4, bgcolor: "var(--color-paper)" }}><Paper elevation={0} sx={{ width: "100%", maxWidth: 400, p: { xs: 3, sm: 4 }, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-md)" }}><Box sx={{ color: "var(--color-ink)", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Spendly</Box><Box component="h1" sx={{ m: 0, mt: 4, color: "var(--color-ink)", fontSize: "var(--text-2xl)", fontWeight: 750, letterSpacing: "-0.04em" }}>{isRegister ? "Create your account" : "Welcome back"}</Box><Box component="p" sx={{ m: 0, mt: 1, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>{isRegister ? "Start tracking your spending in one place." : "Sign in to view your finances."}</Box>{error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}<Box component="form" onSubmit={submit} noValidate sx={{ mt: 3 }}><Stack spacing={2}>{isRegister && <TextField required label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />}<TextField required label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /><TextField required label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegister ? "new-password" : "current-password"} helperText={isRegister ? "At least 8 characters" : undefined} /><Button type="submit" variant="contained" disabled={loading} sx={{ minHeight: 46, mt: 0.5, bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "var(--color-accent)", boxShadow: "none" } }}>{loading ? "Please wait" : isRegister ? "Create account" : "Sign in"}</Button></Stack></Box><Button type="button" onClick={() => changeMode(isRegister ? "login" : "register")} sx={{ mt: 2, px: 0, color: "var(--color-ink-2)", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: 700 }}>{isRegister ? "Already have an account? Sign in" : "New to Spendly? Create an account"}</Button></Paper></Box>;
}
