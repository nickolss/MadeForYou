import { Paper, Typography, Box, Grid, useTheme } from '@mui/material';
import { Note, Book, Label, PushPin } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface NoteStatsProps {
    total: number;
    pinned: number;
    categories: number;
    recent: number;
}

export function NoteStats({ total, pinned, categories, recent }: NoteStatsProps) {
    const theme = useTheme();

    const stats = [
        {
            label: 'Total de Notas',
            value: total,
            icon: <Note />,
            color: 'primary.main',
        },
        {
            label: 'Fixadas',
            value: pinned,
            icon: <PushPin />,
            color: 'warning.main',
        },
        {
            label: 'Categorias',
            value: categories,
            icon: <Label />,
            color: 'info.main',
        },
        {
            label: 'Esta Semana',
            value: recent,
            icon: <Book />,
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