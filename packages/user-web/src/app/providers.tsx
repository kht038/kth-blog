"use client";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import type { ReactNode } from "react";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Apple SD Gothic Neo, "맑은 고딕", sans-serif;
  }
  a { color: inherit; text-decoration: none; }
`;

const theme = {
  colors: {
    text: "#111",
    subtext: "#666",
    bg: "#fafafa",
    surface: "#ffffff",
    border: "#e9e9e9",
    primary: "#0a7cff",
  },
  spacing: (n: number) => `${n * 8}px`,
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
  },
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
