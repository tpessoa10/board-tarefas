'use client'

import { SessionProvider } from "next-auth/react";
import React from "react";

// Aqui você pode adicionar outras props se precisar, como auth, etc.
interface ProvidersProps {
  children: React.ReactNode;
  session: any; // A prop session para NextAuth
}

export default function Providers({ children, session }: ProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}