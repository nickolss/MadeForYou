import {
    Paper,
    Typography,
    Box,
    IconButton,
    Chip,
    LinearProgress,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import * as React from 'react';
import { HabitCalendar } from './habit-calendar';
import { Habit, HabitEntry } from '@/app/types/habit';

interface HabitItemProps {
    habit: Habit;
    entries: HabitEntry[];
    onEdit: (habit: Habit) => void;
    onDelete: (id: number) => void;
    onToggleEntry: (habitId: number, date: string) => void;
}

const getFrequencyLabel = (frequency: Habit['frequency'], targetDays?: number) => {
    switch (frequency) {
        case 'daily':
            return 'Diário';
        case 'weekly':
            return 'Semanal';
        case 'custom':
            return `${targetDays}x por semana`;
        default:
            return '';
    }
};

const calculateStats = (habit: Habit, entries: HabitEntry[]) => {
    const last30Days = entries.filter(e => {
        const entryDate = new Date(e.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    });

    const completed = last30Days.filter(e => e.completed).length;
    const total = last30Days.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calcular streak atual
    const sortedEntries = [...entries]
        .filter(e => e.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date);
        entryDate.setHours(0, 0, 0, 0);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);

        if (entryDate.getTime() === expectedDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }

    return { completionRate, streak, completed, total };
};

export function HabitItem({ habit, entries, onEdit, onDelete, onToggleEntry }: HabitItemProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const habitEntries = entries.filter(e => e.habitId === habit.id);
    const stats = calculateStats(habit, habitEntries);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: habit.color || 'primary.main',
                },
                transition: 'all 0.2s',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {habit.name}
                        </Typography>
                        {habit.color && (
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: habit.color,
                                }}
                            />
                        )}
                    </Box>
                    {habit.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {habit.description}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                            label={getFrequencyLabel(habit.frequency, habit.targetDays)}
                            size="small"
                            variant="outlined"
                        />
                        {stats.streak > 0 && (
                            <Chip
                                label={`🔥 ${stats.streak} dias`}
                                size="small"
                                color="warning"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Últimos 30 dias: {stats.completed}/{stats.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                {stats.completionRate}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={stats.completionRate}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: habit.color || 'primary.main',
                                },
                            }}
                        />
                    </Box>
                    <HabitCalendar
                        habit={habit}
                        entries={habitEntries}
                        onToggleEntry={onToggleEntry}
                    />
                </Box>
                <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{ color: 'text.secondary' }}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => { onEdit(habit); handleMenuClose(); }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este hábito?')) {
                                onDelete(habit.id);
                            }
                            handleMenuClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Delete fontSize="small" sx={{ mr: 1 }} />
                        Excluir
                    </MenuItem>
                </Menu>
            </Box>
        </Paper>
    );
}

