"use client";

import DashboardLayout from "./layout";
import { ReactNode } from "react";

export default function DashboardLayoutWithGuard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
