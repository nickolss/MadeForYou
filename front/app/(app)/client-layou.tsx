"use client";

import { usePathname } from "next/navigation";
import ThemeRegistry from "../components/theme-registry/ThemeRegistry";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    return (
        <ThemeRegistry>
            {isAuthRoute ? (
                <>{children}</>
            ) : (
                <ProtectedRoute requireAuth={true}>
                    {children}
                </ProtectedRoute>
            )}
        </ThemeRegistry>
    );
}