"use client";

import * as React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Home,
	CheckCircleOutline,
	AccountTree,
	AccountBalance,
	Psychology,
	Note,
	Person,
	Logout,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/app/config/firebase";
import { signOut } from "firebase/auth";
import { AdSpace } from "../ads/ad-space";

export const drawerWidth = 240;

const navItems = [
	{ text: "Início", icon: <Home />, path: "/" },
	{ text: "Minhas Tarefas", icon: <CheckCircleOutline />, path: "/tasks" },
	{ text: "Projetos", icon: <AccountTree />, path: "/projects" },
	{ text: "Hábitos", icon: <Psychology />, path: "/habits" },
	{ text: "Notas", icon: <Note />, path: "/notes" },
	{ text: "Finanças", icon: <AccountBalance />, path: "/finances" },
];

const profileItem = { text: "Meu Perfil", icon: <Person />, path: "/profile" };

export function SideNav() {
	const theme = useTheme();
	const pathname = usePathname();
	const router = useRouter();
	const isDark = theme.palette.mode === "dark";

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push("/login");
		} catch (error) {
			console.error("Erro ao sair:", error);
		}
	};

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					boxSizing: "border-box",
					display: "flex",
					flexDirection: "column",
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Toolbar
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					py: 2,
				}}
			>
				<Link href="/" style={{ textDecoration: "none" }}>
					<Typography
						variant="h5"
						sx={{
							fontWeight: "bold",
							background: isDark
								? "linear-gradient(135deg, #818cf8 0%, #34d399 100%)"
								: "linear-gradient(135deg, #6366f1 0%, #10b981 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							cursor: "pointer",
						}}
					>
						MadeForYou
					</Typography>
				</Link>
			</Toolbar>

			{/* --- MENU PRINCIPAL --- */}
			<List sx={{ flexGrow: 1 }}>
				{navItems.map((item) => {
					const isActive = pathname === item.path;
					return (
						<ListItem key={item.text} disablePadding>
							<ListItemButton
								component={Link}
								href={item.path}
								sx={{
									borderRadius: 1,
									mx: 1,
									mb: 0.5,
									"&:hover": {
										backgroundColor: isDark
											? "rgba(129, 140, 248, 0.1)"
											: "rgba(99, 102, 241, 0.08)",
									},
									...(isActive && {
										backgroundColor: isDark
											? "rgba(129, 140, 248, 0.15)"
											: "rgba(99, 102, 241, 0.1)",
										borderLeft: `3px solid ${theme.palette.primary.main}`,
									}),
									color: isActive ? "primary.main" : "text.primary",
								}}
							>
								<ListItemIcon
									sx={{
										color: isActive ? "primary.main" : "text.secondary",
										minWidth: 40,
									}}
								>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			<Divider sx={{ my: 1 }} />

			<List>
				<ListItem disablePadding>
					<ListItemButton
						component={Link}
						href={profileItem.path}
						sx={{
							borderRadius: 1,
							mx: 1,
							mb: 0.5,
							"&:hover": {
								backgroundColor: isDark
									? "rgba(129, 140, 248, 0.1)"
									: "rgba(99, 102, 241, 0.08)",
							},
							...(pathname === profileItem.path && {
								backgroundColor: isDark
									? "rgba(129, 140, 248, 0.15)"
									: "rgba(99, 102, 241, 0.1)",
								borderLeft: `3px solid ${theme.palette.primary.main}`,
							}),
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
							{profileItem.icon}
						</ListItemIcon>
						<ListItemText primary={profileItem.text} />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton
						onClick={handleLogout}
						sx={{
							borderRadius: 1,
							mx: 1,
							mb: 0.5,
							color: "error.main",
							"&:hover": {
								backgroundColor: isDark
									? "rgba(244, 67, 54, 0.1)"
									: "rgba(211, 47, 47, 0.08)",
							},
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
							<Logout />
						</ListItemIcon>
						<ListItemText primary="Sair" />
					</ListItemButton>
				</ListItem>
			</List>

			<Box sx={{ p: 2, mt: "auto" }}>
				<AdSpace size="sidebar" adId="sidebar-main" />
			</Box>
		</Drawer>
	);
}
