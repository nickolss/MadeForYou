import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import ClientLayout from "./client-layou";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Made For You",
	description: "Seu app de organização",
	other: {
		"google-adsense-account":
			process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "",
	},
};

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
						strategy="afterInteractive"
					/>
				)}
			</head>
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
