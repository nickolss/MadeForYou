"use client";

import * as React from 'react';
import { 
    Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Grid, CircularProgress, Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { HabitStats } from '@/app/components/habits/habit-stats';
import { HabitListEnhanced } from '@/app/components/habits/habit-list-enhanced';
import { AdSpace } from '@/app/components/ads/ad-space';
import { useHabits } from '@/app/hooks/useHabits';
import { Habit } from '@/app/types/habit';

export default function HabitsPage() {
    const userName = "Usuário";
    const { habits, entries, loading, error, createHabit, updateHabit, deleteHabit, toggleHabitEntry } = useHabits();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        color: '#6366f1',
        frequency: 'daily' as Habit['frequency'],
        targetDays: 7,
    });

    const handleToggleEntry = async (habitId: number, date: string) => {
        try {
            await toggleHabitEntry(habitId, date);
        } catch (err) {
            console.error('Erro ao atualizar entrada de hábito:', err);
            alert('Erro ao atualizar entrada. Tente novamente.');
        }
    };

    const handleDeleteHabit = async (habitId: number) => {
        if (confirm('Tem certeza que deseja excluir este hábito?')) {
            try {
                await deleteHabit(habitId);
            } catch (err) {
                console.error('Erro ao deletar hábito:', err);
                alert('Erro ao deletar hábito. Tente novamente.');
            }
        }
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

    const handleSaveHabit = async () => {
        if (!formData.name.trim()) return;

        setSaving(true);
        try {
            if (editingHabit) {
                await updateHabit(editingHabit.id, {
                    name: formData.name,
                    description: formData.description || undefined,
                    color: formData.color,
                    frequency: formData.frequency,
                    targetDays: formData.frequency === 'custom' ? formData.targetDays : undefined,
                });
            } else {
                await createHabit({
                    name: formData.name,
                    description: formData.description || undefined,
                    color: formData.color,
                    frequency: formData.frequency,
                    targetDays: formData.frequency === 'custom' ? formData.targetDays : undefined,
                });
            }
            setOpenDialog(false);
        } catch (err) {
            console.error('Erro ao salvar hábito:', err);
            alert('Erro ao salvar hábito. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error.message}
                    </Alert>
                )}

                <HabitStats {...stats} />

                <Box sx={{ my: 3 }}>
                    <AdSpace size="inline" adId="habits-top" />
                </Box>

                <Grid container spacing={3}>
                    <Grid size={12}>
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
                                {/* CORREÇÃO AQUI: item -> removido, xs/sm -> size */}
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Grid size={12}>
                                    <TextField
                                        label="Cor"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        fullWidth
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
                            disabled={!formData.name.trim() || saving}
                            sx={{ textTransform: 'none' }}
                        >
                            {saving ? <CircularProgress size={20} /> : editingHabit ? 'Salvar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}