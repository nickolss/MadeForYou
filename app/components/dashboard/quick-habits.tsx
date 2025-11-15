import { Habit, HabitEntry } from '@/app/types';
import { Paper, Typography, Box, Button, LinearProgress } from '@mui/material';
import Link from 'next/link';

interface QuickHabitsProps {
    habits: Habit[];
    entries: HabitEntry[];
}

export function QuickHabits({ habits, entries }: QuickHabitsProps) {
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    const todayCompleted = habits.filter(habit => {
        const entry = entries.find(e => e.habitId === habit.id && e.date === todayKey && e.completed);
        return !!entry;
    }).length;

    const activeHabits = habits.slice(0, 3);

    return (
        <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Hábitos de Hoje
                </Typography>
                <Button
                    component={Link}
                    href="/habits"
                    size="small"
                    sx={{ textTransform: 'none' }}
                >
                    Ver todos →
                </Button>
            </Box>
            
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {todayCompleted} de {habits.length} completados hoje
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0}%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={habits.length > 0 ? (todayCompleted / habits.length) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </Box>

            {activeHabits.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Nenhum hábito cadastrado
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {activeHabits.map((habit) => {
                        const entry = entries.find(e => e.habitId === habit.id && e.date === todayKey);
                        const isCompleted = entry?.completed || false;

                        return (
                            <Box
                                key={habit.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1.5,
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: isCompleted ? `${habit.color || 'success.main'}10` : 'transparent',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: habit.color || 'primary.main',
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flexGrow: 1,
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                        color: isCompleted ? 'text.secondary' : 'text.primary',
                                    }}
                                >
                                    {habit.name}
                                </Typography>
                                {isCompleted && (
                                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                                        ✓
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
}

