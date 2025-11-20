import { Paper, Typography, Box, Grid, useTheme } from "@mui/material";
import { CheckCircle, Pending, TrendingUp, Percent } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

interface TaskStatsProps {
	total: number;
	completed: number;
	pending: number;
}

export function TaskStats({ total, completed, pending }: TaskStatsProps) {
	const theme = useTheme();
	const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

	const stats = [
		{
			label: "Total",
			value: total,
			icon: <TrendingUp />,
			color: "primary.main",
		},
		{
			label: "Concluídas",
			value: completed,
			icon: <CheckCircle />,
			color: "success.main",
		},
		{
			label: "Pendentes",
			value: pending,
			icon: <Pending />,
			color: "warning.main",
		},
	];

	return (
		<Grid container spacing={2} sx={{ mb: 3 }}>
			{stats.map((stat) => (
				<Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
					<Paper
						elevation={0}
						sx={{
							p: 2.5,
							display: "flex",
							alignItems: "center",
							gap: 2,
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: 48,
								height: 48,
								borderRadius: 2,
								backgroundColor: (() => {
									const colorName = stat.color.split(".")[0] as
										| "primary"
										| "info"
										| "warning"
										| "success";
									return theme.palette[colorName]
										? alpha(theme.palette[colorName].main, 0.15)
										: "rgba(0,0,0,0.1)";
								})(),
								color: stat.color,
							}}
						>
							{stat.icon}
						</Box>
						<Box>
							<Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
								{stat.value}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{stat.label}
							</Typography>
						</Box>
					</Paper>
				</Grid>
			))}

			{/* Card Estático de Porcentagem */}
			<Grid size={{ xs: 12, sm: 6, md: 3 }}>
				<Paper
					elevation={0}
					sx={{
						p: 2.5,
						display: "flex",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 48,
							height: 48,
							borderRadius: 2,
							backgroundColor: alpha(theme.palette.primary.main, 0.15),
							color: "primary.main",
						}}
					>
						<Percent />
					</Box>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
							{completionRate}%
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Taxa de Conclusão
						</Typography>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
