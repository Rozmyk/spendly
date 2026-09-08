"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Avatar, Box, Button, CircularProgress, Divider, Paper, Stack, TextField } from "@mui/material";
import { authClient } from "../../lib/auth-client";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNavigation from "../dashboard/SidebarNavigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isPending && !session) router.replace("/"); }, [isPending, router, session]);
  useEffect(() => { if (session) setName(session.user.name); }, [session]);

  const initials = useMemo(() => session?.user.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S", [session?.user.name]);

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

  return <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-paper)" }}><DashboardHeader user={session.user} /><Box sx={{ display: "flex", minHeight: "calc(100vh - 76px)" }}><SidebarNavigation /><Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 4 } }}><Box sx={{ maxWidth: 700, mx: "auto" }}><Button component={Link} href="/" sx={{ mb: 3, px: 0, color: "var(--color-ink-2)", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>← Back to overview</Button><Box component="header" sx={{ mb: 4 }}><Box sx={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.12em" }}>ACCOUNT</Box><Box component="h1" sx={{ m: 0, mt: 1, color: "var(--color-ink)", fontSize: { xs: "var(--text-2xl)", md: "2.8rem" }, lineHeight: 1.05, letterSpacing: "-0.06em", fontWeight: 800 }}>Profile settings</Box><Box component="p" sx={{ maxWidth: 440, m: 0, mt: 1.25, color: "var(--color-muted)", fontSize: "var(--text-md)" }}>Your account details, kept simple.</Box></Box><Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid var(--color-rule)", borderRadius: "var(--radius-lg)" }}><Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}><Avatar src={session.user.image || undefined} sx={{ width: 64, height: 64, bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", fontSize: "var(--text-lg)", fontWeight: 800 }}>{initials}</Avatar><Box><Box sx={{ color: "var(--color-ink)", fontSize: "var(--text-lg)", fontWeight: 800, letterSpacing: "-0.035em" }}>{session.user.name}</Box><Box sx={{ mt: 0.25, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>{session.user.email}</Box></Box></Stack><Divider sx={{ my: 4, borderColor: "var(--color-rule)" }} />{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}<Box component="form" onSubmit={save} noValidate><Stack spacing={2.25}><TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required fullWidth /><TextField label="Email address" value={session.user.email} disabled fullWidth helperText="Email address is set when you create the account." /><Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.75 }}><Button type="submit" variant="contained" disabled={saving || name.trim() === session.user.name} sx={{ minHeight: 46, px: 2.5, bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", textTransform: "none", fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "var(--color-accent)", boxShadow: "none" } }}>{saving ? "Saving…" : "Save changes"}</Button></Box></Stack></Box></Paper><Box sx={{ mt: 4, pt: 3, borderTop: "1px solid var(--color-rule)" }}><Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>Session</Box><Box sx={{ mt: 0.5, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>End this session on this device.</Box><Button type="button" onClick={() => void signOut()} sx={{ mt: 1.5, px: 0, color: "var(--color-danger)", textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>Sign out</Button></Box></Box></Box></Box></Box>;
}
