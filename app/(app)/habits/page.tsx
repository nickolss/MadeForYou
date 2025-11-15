"use client";

import * as React from 'react';
import { Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Habit, HabitEntry } from '@/app/types';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { HabitStats } from '@/app/components/habits/habit-stats';
import { HabitListEnhanced } from '@/app/components/habits/habit-list-enhanced';
import { AdSpace } from '@/app/components/ads/ad-space';

const mockHabits: Habit[] = [
    {
        id: 1,
        name: 'Exercitar-se',
        description: 'Fazer pelo menos 30 minutos de exercício',
        color: '#10b981',
        frequency: 'daily',
        createdAt: '2024-01-01',
    },
    {
        id: 2,
        name: 'Ler',
        description: 'Ler pelo menos 20 páginas por dia',
        color: '#6366f1',
        frequency: 'daily',
        createdAt: '2024-01-05',
    },
    {
        id: 3,
        name: 'Meditar',
        description: '10 minutos de meditação',
        color: '#f59e0b',
        frequency: 'daily',
        createdAt: '2024-01-10',
    },
];

const mockEntries: HabitEntry[] = [
    // Exercitar-se - últimos 7 dias
    { id: 1, habitId: 1, date: '2024-01-15', completed: true },
    { id: 2, habitId: 1, date: '2024-01-14', completed: true },
    { id: 3, habitId: 1, date: '2024-01-13', completed: false },
    { id: 4, habitId: 1, date: '2024-01-12', completed: true },
    { id: 5, habitId: 1, date: '2024-01-11', completed: true },
    { id: 6, habitId: 1, date: '2024-01-10', completed: true },
    { id: 7, habitId: 1, date: '2024-01-09', completed: true },
    // Ler
    { id: 8, habitId: 2, date: '2024-01-15', completed: true },
    { id: 9, habitId: 2, date: '2024-01-14', completed: true },
    { id: 10, habitId: 2, date: '2024-01-13', completed: true },
    { id: 11, habitId: 2, date: '2024-01-12', completed: false },
    { id: 12, habitId: 2, date: '2024-01-11', completed: true },
    // Meditar
    { id: 13, habitId: 3, date: '2024-01-15', completed: true },
    { id: 14, habitId: 3, date: '2024-01-14', completed: true },
    { id: 15, habitId: 3, date: '2024-01-13', completed: true },
];

export default function HabitsPage() {
    const userName = "Usuário";
    const [habits, setHabits] = React.useState<Habit[]>(mockHabits);
    const [entries, setEntries] = React.useState<HabitEntry[]>(mockEntries);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        color: '#6366f1',
        frequency: 'daily' as Habit['frequency'],
        targetDays: 7,
    });

    const handleToggleEntry = (habitId: number, date: string) => {
        const existingEntry = entries.find(e => e.habitId === habitId && e.date === date);
        
        if (existingEntry) {
            setEntries(entries.map(e =>
                e.id === existingEntry.id
                    ? { ...e, completed: !e.completed }
                    : e
            ));
        } else {
            const newEntry: HabitEntry = {
                id: Math.max(...entries.map(e => e.id), 0) + 1,
                habitId,
                date,
                completed: true,
            };
            setEntries([...entries, newEntry]);
        }
    };

    const handleDeleteHabit = (habitId: number) => {
        setHabits(habits.filter(h => h.id !== habitId));
        setEntries(entries.filter(e => e.habitId !== habitId));
    };

    const handleEditHabit = (habit: Habit) => {
        setEditingHabit(habit);
        setFormData({
            name: habit.name,
            description: habit.description || '',
            color: habit.color || '#6366f1',
            frequency: habit.frequency,
            targetDays: habit.targetDays || 7,
        });
        setOpenDialog(true);
    };

    const handleAddHabit = () => {
        setEditingHabit(null);
        setFormData({
            name: '',
            description: '',
            color: '#6366f1',
            frequency: 'daily',
            targetDays: 7,
        });
        setOpenDialog(true);
    };

    const handleSaveHabit = () => {
        if (!formData.name.trim()) return;

        if (editingHabit) {
            setHabits(habits.map(habit =>
                habit.id === editingHabit.id
                    ? { ...habit, ...formData }
                    : habit
            ));
        } else {
            const newHabit: Habit = {
                id: Math.max(...habits.map(h => h.id), 0) + 1,
                name: formData.name,
                description: formData.description || undefined,
                color: formData.color,
                frequency: formData.frequency,
                targetDays: formData.frequency === 'custom' ? formData.targetDays : undefined,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setHabits([...habits, newHabit]);
        }
        setOpenDialog(false);
    };

    // Calcular estatísticas
    const last30DaysEntries = entries.filter(e => {
        const entryDate = new Date(e.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    });

    const completedEntries = last30DaysEntries.filter(e => e.completed).length;
    const totalEntries = last30DaysEntries.length;
    const completionRate = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;

    // Calcular streak atual (dias consecutivos)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        const hasCompletedToday = habits.some(habit => {
            const entry = entries.find(e => e.habitId === habit.id && e.date === dateKey && e.completed);
            return !!entry;
        });

        if (hasCompletedToday) {
            currentStreak++;
        } else if (i > 0) {
            break;
        }
    }

    const stats = {
        total: habits.length,
        active: habits.length,
        currentStreak,
        completionRate,
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <TopNav userName={userName} />
            <SideNav />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}
            >
                <Toolbar />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Meus Hábitos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddHabit}
                        sx={{ textTransform: 'none' }}
                    >
                        Novo Hábito
                    </Button>
                </Box>

                <HabitStats {...stats} />

                <Box sx={{ my: 3 }}>
                    <AdSpace size="inline" adId="habits-top" />
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <HabitListEnhanced
                            habits={habits}
                            entries={entries}
                            onEditHabit={handleEditHabit}
                            onDeleteHabit={handleDeleteHabit}
                            onToggleEntry={handleToggleEntry}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ my: 3 }}>
                    <AdSpace size="banner" adId="habits-bottom" />
                </Box>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingHabit ? 'Editar Hábito' : 'Novo Hábito'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Nome do hábito"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Descrição"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={2}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Frequência"
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Habit['frequency'] })}
                                        fullWidth
                                    >
                                        <MenuItem value="daily">Diário</MenuItem>
                                        <MenuItem value="weekly">Semanal</MenuItem>
                                        <MenuItem value="custom">Personalizado</MenuItem>
                                    </TextField>
                                </Grid>
                                {formData.frequency === 'custom' && (
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Vezes por semana"
                                            type="number"
                                            value={formData.targetDays}
                                            onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) || 7 })}
                                            fullWidth
                                            inputProps={{ min: 1, max: 7 }}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Cor"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveHabit}
                            variant="contained"
                            disabled={!formData.name.trim()}
                            sx={{ textTransform: 'none' }}
                        >
                            {editingHabit ? 'Salvar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

