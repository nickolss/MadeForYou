"use client";

import * as React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { GoogleAdUnit } from "./google-ad-unit";
import { adConfig } from "@/app/config/ads";

interface AdSpaceProps {
	size?: "banner" | "sidebar" | "card" | "inline";
	adId: string;
	className?: string;
}

export function AdSpace({ size = "card", adId, className }: AdSpaceProps) {
	const theme = useTheme();

	const showAds = adConfig.enabled;

	const slotId = (adConfig.slots as Record<string, string> | undefined)?.[adId];

	if (showAds && slotId) {
		return (
			<Box
				className={className}
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					my: 2,
					minHeight: adConfig.sizes[size].minHeight,
				}}
			>
				<GoogleAdUnit slotId={slotId} />
			</Box>
		);
	}

	if (!adConfig.showPlaceholder) return null;

	const dimensions = adConfig.sizes[size];

	return (
		<Paper
			elevation={0}
			className={className}
			sx={{
				width: dimensions.width,
				minHeight: dimensions.minHeight,
				maxHeight: dimensions.maxHeight,
				border: "1px dashed",
				borderColor: "divider",
				borderRadius: 2,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor:
					theme.palette.mode === "dark"
						? "rgba(255, 255, 255, 0.02)"
						: "rgba(0, 0, 0, 0.02)",
				position: "relative",
				overflow: "hidden",
				my: 2,
			}}
		>
			<Box sx={{ textAlign: "center", p: 2 }}>
				<Typography variant="caption" color="text.secondary" display="block">
					Espaço Publicitário
				</Typography>
				<Typography
					variant="caption"
					color="text.disabled"
					sx={{ fontSize: "0.7rem" }}
				>
					{size.toUpperCase()} • {adId}{" "}
					{slotId ? `(Slot: ${slotId})` : "(Sem Slot)"}
				</Typography>
			</Box>
		</Paper>
	);
}
