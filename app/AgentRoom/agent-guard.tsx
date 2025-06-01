"use client";

import RBACGuard from "@/components/rbac-guard";
import { ReactNode } from "react";

export default function AgentGuard({ children }: { children: ReactNode }) {
  return (
    <RBACGuard allowedRoles={['agent', 'admin']}>
      {children}
    </RBACGuard>
  );
}
