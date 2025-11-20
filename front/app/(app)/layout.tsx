"use client";

import { Roboto } from "next/font/google";
import { usePathname } from "next/navigation";
import ThemeRegistry from "../components/theme-registry/ThemeRegistry";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import Script from "next/script";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAuthRoute = pathname === "/login" || pathname === "/register";

	// Se for rota de autenticação, não aplica proteção (já tem seu próprio layout)
	if (isAuthRoute) {
		return <>{children}</>;
	}

	// Para todas as outras rotas, aplica proteção
	return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

	return (
		<html lang="pt-br" className={roboto.className}>
			<head>
				{publisherId && (
					<Script
						async
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
						crossOrigin="anonymous"
					/>
				)}
			</head>
			<body>
				<ThemeRegistry>
					<LayoutContent>{children}</LayoutContent>
				</ThemeRegistry>
			</body>
		</html>
	);
}
