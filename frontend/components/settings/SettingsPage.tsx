"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, Stack } from "@mui/material";
import { IconLock, IconUser } from "@tabler/icons-react";
import { authClient } from "../../lib/auth-client";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNavigation from "../dashboard/SidebarNavigation";
import LoadingScreen from "../ui/LoadingScreen";

const buttonSx = {
  minHeight: 40,
  px: 1.75,
  borderColor: "var(--color-rule)",
  color: "var(--color-ink-2)",
  fontWeight: 800,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    borderColor: "var(--color-rule)",
    bgcolor: "var(--color-paper-2)",
    boxShadow: "none",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (!isPending && !session) router.replace("/");
  if (isPending || !session)
    return <LoadingScreen label="Opening your settings" />;

  const signOut = async () => {
    await authClient.signOut();
    router.replace("/");
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
          <Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 860, mx: "auto" }}>
            <Box>
              <Box
                sx={{
                  color: "var(--color-accent)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                WORKSPACE SETTINGS
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
                Keep your space in order.
              </Box>
              <Box
                sx={{
                  mt: 1,
                  color: "var(--color-muted)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Manage your account and understand how your financial data is
                handled.
              </Box>
            </Box>
            <SettingsCard
              icon={<IconUser size={20} />}
              title="Account"
              description={`${session.user.name} · ${session.user.email}`}
            >
              <Button
                component={Link}
                href="/profile"
                variant="outlined"
                sx={buttonSx}
              >
                Edit profile
              </Button>
            </SettingsCard>
            <SettingsCard
              icon={<IconLock size={20} />}
              title="Data privacy"
              description="Expenses and budgets are isolated by your authenticated account. Your monthly budget is stored securely in the database, not only in this browser."
            >
              <Button
                onClick={() => void signOut()}
                variant="outlined"
                sx={buttonSx}
              >
                Sign out
              </Button>
            </SettingsCard>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                border: "1px solid var(--color-rule)",
                borderRadius: "var(--radius-md)",
                bgcolor: "var(--color-paper-2)",
              }}
            >
              <Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>
                Your workspace
              </Box>
              <Box
                sx={{
                  mt: 0.6,
                  color: "var(--color-muted)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                }}
              >
                Spendly currently records expenses in PLN. Your budget follows
                you across devices when you sign in to the same account.
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2.5,
        p: { xs: 2.5, sm: 3 },
        border: "1px solid var(--color-rule)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            display: "grid",
            width: 36,
            height: 36,
            flexShrink: 0,
            placeItems: "center",
            borderRadius: "10px",
            color: "var(--color-accent)",
            bgcolor: "var(--color-accent-soft)",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Box sx={{ color: "var(--color-ink)", fontWeight: 800 }}>{title}</Box>
          <Box
            sx={{
              mt: 0.45,
              maxWidth: 510,
              color: "var(--color-muted)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.55,
            }}
          >
            {description}
          </Box>
        </Box>
      </Box>
      {children}
    </Paper>
  );
}
