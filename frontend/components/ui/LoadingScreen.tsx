"use client";

import { Box } from "@mui/material";

type LoadingScreenProps = {
  label?: string;
};

export default function LoadingScreen({ label = "Preparing your space" }: LoadingScreenProps) {
  return (
    <Box className="loading-screen" role="status" aria-live="polite" aria-label={label}>
      <Box className="loading-screen__mark" aria-hidden="true">
        <Box className="loading-screen__coin">S</Box>
      </Box>
      <Box className="loading-screen__copy">
        <Box component="span" className="loading-screen__label">{label}</Box>
        <Box className="loading-screen__progress" />
      </Box>
    </Box>
  );
}
