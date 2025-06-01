"use client";

import RBACGuard from "@/components/rbac-guard";
import { ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RBACGuard allowedRoles={['admin']}>
      {children}
    </RBACGuard>
  );
}
