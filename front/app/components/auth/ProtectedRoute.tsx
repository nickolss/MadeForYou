"use client";

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requer autenticação, false = redireciona se autenticado
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      if (requireAuth) {
        // Se a rota requer autenticação e o usuário não está logado
        if (!currentUser) {
          router.push('/login');
        }
      } else {
        // Se a rota NÃO requer autenticação (login/register) e o usuário já está logado
        if (currentUser) {
          router.push('/');
        }
      }
    }
  }, [currentUser, loading, router, requireAuth]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se a rota requer autenticação e o usuário não está logado, não renderiza nada
  if (requireAuth && !currentUser) {
    return null;
  }

  // Se a rota NÃO requer autenticação (login/register) e o usuário já está logado, não renderiza nada
  if (!requireAuth && currentUser) {
    return null;
  }

  return <>{children}</>;
}

