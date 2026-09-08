"use client";

import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

export type AppButtonTone = "primary" | "neutral" | "danger" | "success";

interface AppButtonProps extends Omit<ButtonProps, "color" | "sx" | "variant"> {
  tone?: AppButtonTone;
  sx?: SystemStyleObject<Theme>;
}

const toneStyles = {
  primary: { bgcolor: "var(--color-accent)", color: "var(--color-accent-ink)", "&:hover": { bgcolor: "var(--color-accent)" } },
  neutral: { bgcolor: "var(--color-paper-2)", color: "var(--color-ink)", "&:hover": { bgcolor: "var(--color-paper-3)" } },
  danger: { bgcolor: "var(--color-error)", color: "var(--color-accent-ink)", "&:hover": { bgcolor: "var(--color-error)" } },
  success: { bgcolor: "var(--color-success)", color: "var(--color-accent-ink)", "&:hover": { bgcolor: "var(--color-success)" } },
};

export default function AppButton({ tone = "primary", sx, ...props }: AppButtonProps) {
  return <Button variant="contained" disableElevation sx={{ minHeight: 46, px: 2.5, borderRadius: "var(--radius-sm)", textTransform: "none", fontWeight: 800, transition: "background-color var(--dur-short) var(--ease-out), transform var(--dur-short) var(--ease-out)", "&:hover, &.is-hover": { transform: "translateY(-1px)" }, "&:focus-visible, &.is-focus": { outline: "3px solid var(--color-focus)", outlineOffset: 2 }, "&:active, &.is-active": { transform: "translateY(1px)" }, "&.Mui-disabled": { bgcolor: "var(--color-paper-3)", color: "var(--color-muted)" }, ...toneStyles[tone], ...sx }} {...props} />;
}
