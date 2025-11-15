import { Habit, HabitEntry } from '@/app/types';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { HabitItem } from './habit-item';

interface HabitListEnhancedProps {
    habits: Habit[];
    entries: HabitEntry[];
    onEditHabit: (habit: Habit) => void;
    onDeleteHabit: (id: number) => void;
    onToggleEntry: (habitId: number, date: string) => void;
    title?: string;
}

export function HabitListEnhanced({
    habits,
    entries,
    onEditHabit,
    onDeleteHabit,
    onToggleEntry,
    title = 'Meus Hábitos',
}: HabitListEnhancedProps) {
    if (habits.length === 0) {
        return (
            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Box
                    sx={{
                        py: 6,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Nenhum hábito cadastrado. Comece criando seu primeiro hábito!
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {title} ({habits.length})
            </Typography>
            <Grid container spacing={2}>
                {habits.map((habit) => (
                    <Grid item xs={12} md={6} key={habit.id}>
                        <HabitItem
                            habit={habit}
                            entries={entries}
                            onEdit={onEditHabit}
                            onDelete={onDeleteHabit}
                            onToggleEntry={onToggleEntry}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

