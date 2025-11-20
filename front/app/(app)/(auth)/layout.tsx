"use client";

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Rotas de autenticação: redireciona se já estiver logado
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
}

