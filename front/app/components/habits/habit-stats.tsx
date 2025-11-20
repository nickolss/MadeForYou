import { Paper, Typography, Box, Grid, useTheme } from '@mui/material';
import { LocalFireDepartment, CheckCircle, TrendingUp, CalendarToday } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface HabitStatsProps {
    total: number;
    active: number;
    currentStreak: number;
    completionRate: number;
}

export function HabitStats({ total, active, currentStreak, completionRate }: HabitStatsProps) {
    const theme = useTheme();

    const stats = [
        {
            label: 'Total de Hábitos',
            value: total,
            icon: <CheckCircle />,
            color: 'primary.main',
        },
        {
            label: 'Hábitos Ativos',
            value: active,
            icon: <TrendingUp />,
            color: 'info.main',
        },
        {
            label: 'Sequência Atual',
            value: currentStreak,
            icon: <LocalFireDepartment />,
            color: 'warning.main',
        },
        {
            label: 'Taxa de Conclusão',
            value: `${completionRate}%`,
            icon: <CalendarToday />,
            color: 'success.main',
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                backgroundColor: (() => {
                                    const colorName = stat.color.split('.')[0] as 'primary' | 'info' | 'warning' | 'success';
                                    return theme.palette[colorName] ? alpha(theme.palette[colorName].main, 0.15) : 'rgba(0,0,0,0.1)';
                                })(),
                                color: stat.color,
                            }}
                        >
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.label}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}