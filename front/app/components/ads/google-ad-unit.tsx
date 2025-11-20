"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface GoogleAdUnitProps {
	slotId: string;
	format?: "auto" | "fluid" | "rectangle";
	responsive?: boolean;
	style?: React.CSSProperties;
}

declare global {
	interface Window {
		adsbygoogle: unknown[];
	}
}

export function GoogleAdUnit({
	slotId,
	format = "auto",
	responsive = true,
	style,
}: GoogleAdUnitProps) {
	const pathname = usePathname();
	const adRef = useRef<HTMLModElement>(null);
	const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

	useEffect(() => {
		if (!publisherId) return;

		try {
			if (adRef.current) {
				(window.adsbygoogle = window.adsbygoogle || []).push({});
			}
		} catch (err) {
			console.error("AdSense error:", err);
		}
	}, [pathname, publisherId]);

	if (!publisherId) return null;

	return (
		<div style={{ overflow: "hidden", ...style }}>
			<ins
				ref={adRef}
				className="adsbygoogle"
				style={{ display: "block", ...style }}
				data-ad-client={publisherId}
				data-ad-slot={slotId}
				data-ad-format={format}
				data-full-width-responsive={responsive ? "true" : "false"}
			/>
		</div>
	);
}
