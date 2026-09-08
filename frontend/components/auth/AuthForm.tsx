"use client";

import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField } from "@mui/material";
import { authClient } from "../../lib/auth-client";

type AuthMode = "login" | "register";

interface AuthFormProps { onAuthenticated: () => void; }

export default function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setLoading(true);
    const result = isRegister ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) { setError(result.error.message || "Unable to continue. Please try again."); return; }
    onAuthenticated();
  };
  const changeMode = (nextMode: AuthMode) => { setMode(nextMode); setError(""); };

  return <Box component="main" sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.04fr) minmax(400px, 0.96fr)" }, bgcolor: "var(--color-paper)" }}><Box sx={{ position: "relative", overflow: "hidden", display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", p: { md: 5, lg: 7 }, bgcolor: "var(--color-paper-2)", color: "var(--color-ink)" }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "var(--color-accent)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.06em" }}><Box sx={{ width: 31, height: 31, display: "grid", placeItems: "center", border: "3px solid var(--color-accent)", borderRadius: "50%", fontSize: "0.9rem" }}>S</Box>Spendly</Box><Box sx={{ position: "relative", zIndex: 1, maxWidth: 520 }}><Box sx={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em" }}>PERSONAL FINANCE, CLARIFIED</Box><Box component="h1" sx={{ m: 0, mt: 2, fontSize: { md: "3.7rem", lg: "4.7rem" }, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.07em" }}>Make space for the life you&apos;re building.</Box><Box component="p" sx={{ maxWidth: 390, mt: 3, mb: 0, color: "var(--color-ink-2)", fontSize: "var(--text-lg)", lineHeight: 1.6 }}>One calm place for the everyday decisions behind your money.</Box></Box><Box sx={{ position: "absolute", right: -180, bottom: -210, width: 520, height: 520, borderRadius: "52% 48% 44% 56%", bgcolor: "var(--color-accent-soft)", transform: "rotate(-21deg)" }} /><Box sx={{ position: "absolute", right: 82, bottom: 92, width: 142, height: 142, border: "1px solid var(--color-accent)", borderRadius: "50%" }} /></Box><Box sx={{ display: "grid", placeItems: "center", px: { xs: 2, sm: 4 }, py: 4 }}><Paper elevation={0} sx={{ width: "100%", maxWidth: 410, p: { xs: 2.5, sm: 4 }, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-lg)" }}><Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, color: "var(--color-accent)", fontSize: "1.2rem", fontWeight: 800 }}><Box sx={{ width: 26, height: 26, display: "grid", placeItems: "center", border: "2px solid var(--color-accent)", borderRadius: "50%", fontSize: "0.75rem" }}>S</Box>Spendly</Box><Box component="h2" sx={{ m: 0, mt: { xs: 4, md: 0 }, color: "var(--color-ink)", fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.05em" }}>{isRegister ? "Start with clarity." : "Welcome back."}</Box><Box component="p" sx={{ m: 0, mt: 1, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>{isRegister ? "Create your Spendly account." : "Sign in to continue to your space."}</Box>{error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}<Box component="form" onSubmit={submit} noValidate sx={{ mt: 3 }}><Stack spacing={2}>{isRegister && <TextField required label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />}<TextField required label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /><TextField required label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegister ? "new-password" : "current-password"} helperText={isRegister ? "At least 8 characters" : undefined} /><Button type="submit" variant="contained" disabled={loading} sx={{ minHeight: 48, bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "var(--color-accent)", boxShadow: "none" } }}>{loading ? "Please wait" : isRegister ? "Create account" : "Sign in"}</Button></Stack></Box><Button type="button" onClick={() => changeMode(isRegister ? "login" : "register")} sx={{ mt: 2.25, px: 0, color: "var(--color-ink-2)", textTransform: "none", fontSize: "var(--text-sm)", fontWeight: 700 }}>{isRegister ? "Already have an account? Sign in" : "New to Spendly? Create an account"}</Button></Paper></Box></Box>;
}
