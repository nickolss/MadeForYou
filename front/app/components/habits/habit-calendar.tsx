import { Box, Typography, IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import * as React from 'react';
import { Habit, HabitEntry } from '@/app/types/habit';

interface HabitCalendarProps {
    habit: Habit;
    entries: HabitEntry[];
    onToggleEntry: (habitId: number, date: string) => void;
}

export function HabitCalendar({ habit, entries, onToggleEntry }: HabitCalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const formatDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const isDateCompleted = (date: Date) => {
        const dateKey = formatDateKey(date);
        const entry = entries.find(e => e.date === dateKey);
        return entry?.completed || false;
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateKey = formatDateKey(date);
        onToggleEntry(habit.id, dateKey);
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                          currentMonth.getFullYear() === today.getFullYear();

    const days = [];
    // Espaços vazios para o primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Typography>
                <Box>
                    <IconButton size="small" onClick={goToPreviousMonth}>
                        ←
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={goToNextMonth}
                        disabled={isCurrentMonth}
                    >
                        →
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 0.5,
                }}
            >
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <Typography
                        key={day}
                        variant="caption"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            py: 0.5,
                        }}
                    >
                        {day}
                    </Typography>
                ))}
                {days.map((day, index) => {
                    if (day === null) {
                        return <Box key={`empty-${index}`} />;
                    }

                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const completed = isDateCompleted(date);
                    const isToday = isCurrentMonth && day === today.getDate();

                    return (
                        <IconButton
                            key={day}
                            onClick={() => handleDateClick(day)}
                            sx={{
                                minWidth: 32,
                                height: 32,
                                p: 0,
                                borderRadius: 1,
                                border: isToday ? '2px solid' : '1px solid',
                                borderColor: isToday ? 'primary.main' : completed ? habit.color || 'success.main' : 'divider',
                                backgroundColor: completed 
                                    ? `${habit.color || 'success.main'}20` 
                                    : 'transparent',
                                color: completed ? habit.color || 'success.main' : 'text.secondary',
                                '&:hover': {
                                    backgroundColor: completed 
                                        ? `${habit.color || 'success.main'}30` 
                                        : 'action.hover',
                                },
                            }}
                        >
                            {completed ? (
                                <CheckCircle fontSize="small" />
                            ) : (
                                <Typography variant="caption">{day}</Typography>
                            )}
                        </IconButton>
                    );
                })}
            </Box>
        </Box>
    );
}

