"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode?: AuthMode;
  onSubmit?: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void> | void;
}

export default function AuthForm({
  mode: initialMode = "login",
  onSubmit,
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (isRegister) {
      if (!name) {
        setError("Name is required.");
        return;
      }

      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      await onSubmit?.({
        email,
        password,
        ...(isRegister && { name }),
      });
    } catch {
      setError(
        isRegister
          ? "Unable to create your account."
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: 440,
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Box
          component="h1"
          sx={{
            fontSize: "1.875rem",
            fontWeight: 700,
            m: 0,
            mb: 1,
          }}
        >
          {isRegister ? "Create account" : "Welcome back"}
        </Box>

        <Box
          component="p"
          sx={{
            color: "text.secondary",
            m: 0,
          }}
        >
          {isRegister
            ? "Create your account to get started."
            : "Sign in to continue to your account."}
        </Box>
      </Box>

     

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            autoComplete="name"
          />
        )}

        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          autoComplete="email"
        />

        <TextField
          fullWidth
          required
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          autoComplete={isRegister ? "new-password" : "current-password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? (
                      <IconEyeOff size={20} />
                    ) : (
                      <IconEye size={20} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {isRegister && (
          <TextField
            fullWidth
            required
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <IconEyeOff size={20} />
                      ) : (
                        <IconEye size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {!isRegister && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
              mb: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />

            <Button
              type="button"
              variant="text"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Forgot password?
            </Button>
          </Box>
        )}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: isRegister ? 3 : 1,
            py: 1.4,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Box
          component="span"
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
          }}
        >
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
        </Box>

        <Button
          variant="text"
          size="small"
          onClick={() =>
            handleModeChange(isRegister ? "login" : "register")
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            p: 0,
            minWidth: "auto",
          }}
        >
          {isRegister ? "Sign in" : "Sign up"}
        </Button>
      </Box>
    </Paper>
  );
}