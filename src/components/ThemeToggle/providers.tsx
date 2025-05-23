"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[
        "white",
        "blue",
        "green",
        "violet",
        "dark",
        "gradient",
        "gradient-2",
        "violet-gradient",
        "zinc",
      ]}
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
