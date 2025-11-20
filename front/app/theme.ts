"use client";
import { createTheme, Theme } from "@mui/material/styles";

export function getTheme(mode: "light" | "dark"): Theme {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f8f9fa",
              paper: "#ffffff",
            },
            text: {
              primary: "#1f2937",
              secondary: "#6b7280",
            },
            divider: "#e5e7eb",
          }
        : {
            background: {
              default: "#0f172a",
              paper: "#1e293b",
            },
            text: {
              primary: "#f1f5f9",
              secondary: "#94a3b8",
            },
            divider: "#334155",
          }),
      primary: {
        main: mode === "light" ? "#6366f1" : "#818cf8",
        light: mode === "light" ? "#818cf8" : "#a5b4fc",
        dark: mode === "light" ? "#4f46e5" : "#6366f1",
      },
      secondary: {
        main: mode === "light" ? "#10b981" : "#34d399",
        light: mode === "light" ? "#34d399" : "#6ee7b7",
        dark: mode === "light" ? "#059669" : "#10b981",
      },
      success: {
        main: mode === "light" ? "#10b981" : "#34d399",
      },
      error: {
        main: mode === "light" ? "#f59e0b" : "#fbbf24",
      },
      warning: {
        main: mode === "light" ? "#f59e0b" : "#fbbf24",
      },
      info: {
        main: mode === "light" ? "#6366f1" : "#818cf8",
      },
    },
    typography: {
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            padding: "10px 20px",
            fontWeight: 500,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
            borderRight:
              mode === "dark" ? "1px solid #334155" : "1px solid #e5e7eb",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark"
                ? "rgba(30, 41, 59, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
            borderBottom:
              mode === "dark" ? "1px solid #334155" : "1px solid #e5e7eb",
            backdropFilter: "blur(12px)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: mode === "dark" ? "1px solid #334155" : "1px solid #e5e7eb",
          },
        },
      },
    },
  });
}
