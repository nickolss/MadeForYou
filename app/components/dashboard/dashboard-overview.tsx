import { Paper, Typography, Box, Grid, Button } from '@mui/material';
import { CheckCircleOutline, AccountTree, AccountBalance, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';

interface DashboardOverviewProps {
    tasksTotal: number;
    tasksCompleted: number;
    projectsTotal: number;
    projectsInProgress: number;
    totalBalance: number;
    recentTransactions: number;
}

export function DashboardOverview({
    tasksTotal,
    tasksCompleted,
    projectsTotal,
    projectsInProgress,
    totalBalance,
    recentTransactions,
}: DashboardOverviewProps) {
    const tasksCompletionRate = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    const cards = [
        {
            title: 'Tarefas',
            value: `${tasksCompleted}/${tasksTotal}`,
            subtitle: `${tasksCompletionRate}% concluídas`,
            icon: <CheckCircleOutline />,
            color: 'primary.main',
            link: '/tasks',
            linkText: 'Ver todas',
        },
        {
            title: 'Projetos',
            value: `${projectsInProgress}/${projectsTotal}`,
            subtitle: 'em progresso',
            icon: <AccountTree />,
            color: 'info.main',
            link: '/projects',
            linkText: 'Ver todos',
        },
        {
            title: 'Finanças',
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totalBalance),
            subtitle: `${recentTransactions} transações recentes`,
            icon: <AccountBalance />,
            color: 'success.main',
            link: '/finances',
            linkText: 'Ver detalhes',
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.title}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: card.color,
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    backgroundColor: `${card.color}15`,
                                    color: card.color,
                                    mr: 2,
                                }}
                            >
                                {card.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {card.title}
                        </Typography>
                        <Button
                            component={Link}
                            href={card.link}
                            size="small"
                            sx={{
                                mt: 'auto',
                                textTransform: 'none',
                                color: card.color,
                            }}
                        >
                            {card.linkText} →
                        </Button>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}

