"use client";

import RBACGuard from "@/components/rbac-guard";
import { ReactNode } from "react";

export default function UserGuard({ children }: { children: ReactNode }) {
  return (
    <RBACGuard allowedRoles={['user', 'admin', 'agent']}>
      {children}
    </RBACGuard>
  );
}
