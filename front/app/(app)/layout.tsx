"use client";

import { Roboto } from 'next/font/google';
import { usePathname } from 'next/navigation';
import ThemeRegistry from '../components/theme-registry/ThemeRegistry';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // Se for rota de autenticação, não aplica proteção (já tem seu próprio layout)
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Para todas as outras rotas, aplica proteção
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={roboto.className}>
      <body>
        <ThemeRegistry>
          <LayoutContent>
            {children}
          </LayoutContent>
        </ThemeRegistry>
      </body>
    </html>
  );
}
