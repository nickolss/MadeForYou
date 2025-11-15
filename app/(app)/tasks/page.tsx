"use client";

import * as React from 'react';
import { Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Task } from '@/app/types';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { TaskStats } from '@/app/components/tasks/task-stats';
import { TaskFilters } from '@/app/components/tasks/task-filters';
import { TaskListEnhanced } from '@/app/components/tasks/task-list-enhanced';

const mockTasks: Task[] = [
    {
        id: 1,
        text: 'Finalizar o relatório de marketing',
        completed: false,
        priority: 'high',
        category: 'Trabalho',
        dueDate: '2024-01-20',
        createdAt: '2024-01-15',
    },
    {
        id: 2,
        text: 'Agendar consulta com o dentista',
        completed: true,
        priority: 'medium',
        category: 'Saúde',
        dueDate: '2024-01-18',
        createdAt: '2024-01-10',
    },
    {
        id: 3,
        text: 'Revisar a proposta do projeto "Orion"',
        completed: false,
        priority: 'high',
        category: 'Trabalho',
        dueDate: '2024-01-19',
        createdAt: '2024-01-14',
    },
    {
        id: 4,
        text: 'Ler 1 capítulo do livro "Hábitos Atômicos"',
        completed: false,
        priority: 'low',
        category: 'Pessoal',
        dueDate: '2024-01-25',
        createdAt: '2024-01-12',
    },
    {
        id: 5,
        text: 'Comprar presentes de aniversário',
        completed: false,
        priority: 'medium',
        category: 'Pessoal',
        dueDate: '2024-01-22',
        createdAt: '2024-01-13',
    },
    {
        id: 6,
        text: 'Atualizar portfólio online',
        completed: true,
        priority: 'low',
        category: 'Trabalho',
        dueDate: '2024-01-17',
        createdAt: '2024-01-08',
    },
];

type FilterType = 'all' | 'pending' | 'completed';

export default function TasksPage() {
    const userName = "Usuário";
    const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
    const [filter, setFilter] = React.useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [formData, setFormData] = React.useState({
        text: '',
        priority: 'medium' as Task['priority'],
        category: '',
        dueDate: '',
    });

    const handleToggleTask = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDeleteTask = (taskId: number) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setFormData({
            text: task.text,
            priority: task.priority || 'medium',
            category: task.category || '',
            dueDate: task.dueDate || '',
        });
        setOpenDialog(true);
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setFormData({
            text: '',
            priority: 'medium',
            category: '',
            dueDate: '',
        });
        setOpenDialog(true);
    };

    const handleSaveTask = () => {
        if (!formData.text.trim()) return;

        if (editingTask) {
            setTasks(tasks.map(task =>
                task.id === editingTask.id
                    ? { ...task, ...formData }
                    : task
            ));
        } else {
            const newTask: Task = {
                id: Math.max(...tasks.map(t => t.id), 0) + 1,
                text: formData.text,
                completed: false,
                priority: formData.priority,
                category: formData.category || undefined,
                dueDate: formData.dueDate || undefined,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setTasks([...tasks, newTask]);
        }
        setOpenDialog(false);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'completed' && task.completed) ||
            (filter === 'pending' && !task.completed);

        const matchesSearch =
            searchQuery === '' ||
            task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
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
                        Minhas Tarefas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddTask}
                        sx={{ textTransform: 'none' }}
                    >
                        Nova Tarefa
                    </Button>
                </Box>

                <TaskStats {...stats} />

                <TaskFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TaskListEnhanced
                            tasks={filteredTasks}
                            onToggleTask={handleToggleTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={handleEditTask}
                        />
                    </Grid>
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Descrição da tarefa"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                fullWidth
                                required
                                multiline
                                rows={3}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Prioridade"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                                        fullWidth
                                    >
                                        <MenuItem value="low">Baixa</MenuItem>
                                        <MenuItem value="medium">Média</MenuItem>
                                        <MenuItem value="high">Alta</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Data de vencimento"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Categoria"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        fullWidth
                                        placeholder="Ex: Trabalho, Pessoal, Saúde..."
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
                            onClick={handleSaveTask}
                            variant="contained"
                            disabled={!formData.text.trim()}
                            sx={{ textTransform: 'none' }}
                        >
                            {editingTask ? 'Salvar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

