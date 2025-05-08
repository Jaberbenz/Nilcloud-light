"use client";

import StoreProvider from "@/providers/StoreProvider";
import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased">
      <StoreProvider>
        <DashboardWrapper>{children}</DashboardWrapper>
      </StoreProvider>
    </div>
  );
}
