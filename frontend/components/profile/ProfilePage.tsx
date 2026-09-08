"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, CircularProgress, Divider, Paper, Stack, TextField } from "@mui/material";
import { authClient } from "../../lib/auth-client";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNavigation from "../dashboard/SidebarNavigation";
import AppButton from "../ui/AppButton";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isPending && !session) router.replace("/"); }, [isPending, router, session]);
  useEffect(() => { if (session) setName(session.user.name); }, [session]);

  if (isPending || !session) return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "var(--color-paper)" }}><CircularProgress size={28} sx={{ color: "var(--color-accent)" }} /></Box>;

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { setError("Enter your name to save the profile."); return; }
    setSaving(true); setError("");
    const result = await authClient.updateUser({ name: trimmedName });
    setSaving(false);
    if (result.error) { setError(result.error.message || "We couldn't save your profile."); return; }
    await refetch();
  };

  const signOut = async () => { await authClient.signOut(); router.replace("/"); };

  return <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}><DashboardHeader /><Box sx={{ display: "flex", minHeight: "calc(100vh - 76px)" }}><SidebarNavigation /><Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 4 } }}><Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 1280, mx: "auto" }}><Paper elevation={0} sx={{ position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(260px, 0.9fr)" }, minHeight: { md: 246 }, borderRadius: "var(--radius-lg)", bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)" }}><Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 4.5 } }}><Box sx={{ fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em", opacity: 0.8 }}>ACCOUNT</Box><Box component="h1" sx={{ maxWidth: 500, m: 0, mt: 2, fontSize: { xs: "2.2rem", md: "3.2rem" }, lineHeight: 1.03, fontWeight: 800, letterSpacing: "-0.06em" }}>Your account, kept simple.</Box><Box sx={{ mt: 2.5, fontSize: "var(--text-md)", fontWeight: 700 }}>{session.user.name}</Box><Box sx={{ mt: 0.25, opacity: 0.8, fontSize: "var(--text-sm)" }}>{session.user.email}</Box></Box><Box sx={{ position: "relative", minHeight: { xs: 130, md: "auto" }, bgcolor: "var(--color-violet)", borderRadius: { xs: "48% 0 0 0", md: "56% 0 0 56%" }, transform: { xs: "translate(25%, 25%)", md: "translate(10%, -16%) rotate(-9deg)" } }} /></Paper><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(280px, 0.65fr)" }, gap: { xs: 3, md: 4 }, alignItems: "start" }}><Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-lg)" }}><Box component="h2" sx={{ m: 0, color: "var(--color-ink)", fontSize: "var(--text-xl)", letterSpacing: "-0.045em", fontWeight: 800 }}>Personal details</Box><Box sx={{ mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>Update the name shown in your workspace.</Box><Divider sx={{ my: 3, borderColor: "var(--color-rule)" }} />{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}<Box component="form" onSubmit={save} noValidate><Stack spacing={2.25}><TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required fullWidth /><TextField label="Email address" value={session.user.email} disabled fullWidth helperText="Email address is set when you create the account." /><Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.75 }}><AppButton type="submit" disabled={saving || name.trim() === session.user.name}>{saving ? "Saving…" : "Save changes"}</AppButton></Box></Stack></Box></Paper><Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-lg)" }}><Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>Session</Box><Box sx={{ mt: 0.75, color: "var(--color-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>End this session on this device when you&apos;re done.</Box><AppButton type="button" onClick={() => void signOut()} sx={{ mt: 2 }}>Sign out</AppButton></Paper></Box></Stack></Box></Box></Box>;
}
