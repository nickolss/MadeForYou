"use client";

import * as React from 'react';
import { Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Project } from '@/app/types';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { ProjectStats } from '@/app/components/projects/project-stats';
import { ProjectFilters } from '@/app/components/projects/project-filters';
import { ProjectListEnhanced } from '@/app/components/projects/project-list-enhanced';
import { AdSpace } from '@/app/components/ads/ad-space';

const mockProjects: Project[] = [
    {
        id: 1,
        name: 'Lançamento do Produto X',
        description: 'Desenvolvimento e lançamento do novo produto no mercado',
        progress: 75,
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-01-01',
        dueDate: '2024-02-15',
        createdAt: '2023-12-15',
    },
    {
        id: 2,
        name: 'Reforma do Apartamento',
        description: 'Reforma completa da cozinha e banheiro',
        progress: 40,
        status: 'in-progress',
        priority: 'medium',
        startDate: '2024-01-10',
        dueDate: '2024-03-30',
        createdAt: '2023-12-20',
    },
    {
        id: 3,
        name: 'Plano de Estudos para Certificação',
        description: 'Preparação para certificação AWS',
        progress: 60,
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-01-05',
        dueDate: '2024-04-01',
        createdAt: '2023-12-10',
    },
    {
        id: 4,
        name: 'Website Corporativo',
        description: 'Redesign completo do website da empresa',
        progress: 100,
        status: 'completed',
        priority: 'medium',
        startDate: '2023-11-01',
        dueDate: '2023-12-31',
        createdAt: '2023-10-15',
    },
    {
        id: 5,
        name: 'Sistema de Gestão',
        description: 'Desenvolvimento de sistema interno',
        progress: 20,
        status: 'planning',
        priority: 'low',
        startDate: '2024-02-01',
        dueDate: '2024-06-30',
        createdAt: '2024-01-15',
    },
];

type FilterType = 'all' | 'planning' | 'in-progress' | 'on-hold' | 'completed';

export default function ProjectsPage() {
    const userName = "Usuário";
    const [projects, setProjects] = React.useState<Project[]>(mockProjects);
    const [filter, setFilter] = React.useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        progress: 0,
        status: 'planning' as Project['status'],
        priority: 'medium' as Project['priority'],
        startDate: '',
        dueDate: '',
    });

    const handleStatusChange = (id: number, status: Project['status']) => {
        setProjects(projects.map(project =>
            project.id === id ? { ...project, status } : project
        ));
    };

    const handleDeleteProject = (projectId: number) => {
        setProjects(projects.filter(project => project.id !== projectId));
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            progress: project.progress,
            status: project.status || 'planning',
            priority: project.priority || 'medium',
            startDate: project.startDate || '',
            dueDate: project.dueDate || '',
        });
        setOpenDialog(true);
    };

    const handleAddProject = () => {
        setEditingProject(null);
        setFormData({
            name: '',
            description: '',
            progress: 0,
            status: 'planning',
            priority: 'medium',
            startDate: '',
            dueDate: '',
        });
        setOpenDialog(true);
    };

    const handleSaveProject = () => {
        if (!formData.name.trim()) return;

        if (editingProject) {
            setProjects(projects.map(project =>
                project.id === editingProject.id
                    ? { ...project, ...formData }
                    : project
            ));
        } else {
            const newProject: Project = {
                id: Math.max(...projects.map(p => p.id), 0) + 1,
                name: formData.name,
                description: formData.description || undefined,
                progress: formData.progress,
                status: formData.status,
                priority: formData.priority,
                startDate: formData.startDate || undefined,
                dueDate: formData.dueDate || undefined,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setProjects([...projects, newProject]);
        }
        setOpenDialog(false);
    };

    const filteredProjects = projects.filter(project => {
        const matchesFilter =
            filter === 'all' ||
            project.status === filter;

        const matchesSearch =
            searchQuery === '' ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        onHold: projects.filter(p => p.status === 'on-hold').length,
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
                        Meus Projetos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddProject}
                        sx={{ textTransform: 'none' }}
                    >
                        Novo Projeto
                    </Button>
                </Box>

                <ProjectStats {...stats} />

                <ProjectFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <Box sx={{ my: 3 }}>
                    <AdSpace size="inline" adId="projects-top" />
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ProjectListEnhanced
                            projects={filteredProjects}
                            onEditProject={handleEditProject}
                            onDeleteProject={handleDeleteProject}
                            onStatusChange={handleStatusChange}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ my: 3 }}>
                    <AdSpace size="banner" adId="projects-bottom" />
                </Box>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Nome do projeto"
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
                                rows={3}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Progresso (%)"
                                        type="number"
                                        value={formData.progress}
                                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                                        fullWidth
                                        inputProps={{ min: 0, max: 100 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                                        fullWidth
                                    >
                                        <MenuItem value="planning">Planejamento</MenuItem>
                                        <MenuItem value="in-progress">Em Progresso</MenuItem>
                                        <MenuItem value="on-hold">Em Pausa</MenuItem>
                                        <MenuItem value="completed">Concluído</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Prioridade"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Project['priority'] })}
                                        fullWidth
                                    >
                                        <MenuItem value="low">Baixa</MenuItem>
                                        <MenuItem value="medium">Média</MenuItem>
                                        <MenuItem value="high">Alta</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Data de início"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Data de conclusão"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                            onClick={handleSaveProject}
                            variant="contained"
                            disabled={!formData.name.trim()}
                            sx={{ textTransform: 'none' }}
                        >
                            {editingProject ? 'Salvar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

