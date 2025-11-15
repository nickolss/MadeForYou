import { Project } from '@/app/types';
import {
    Paper,
    Typography,
    Box,
    LinearProgress,
    IconButton,
    Chip,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert, Edit, Delete, PlayArrow, Pause, CheckCircle } from '@mui/icons-material';
import * as React from 'react';

interface ProjectItemProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: number) => void;
    onStatusChange?: (id: number, status: Project['status']) => void;
}

const getStatusColor = (status?: Project['status']) => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'in-progress':
            return 'info';
        case 'on-hold':
            return 'warning';
        case 'planning':
            return 'default';
        default:
            return 'default';
    }
};

const getStatusLabel = (status?: Project['status']) => {
    switch (status) {
        case 'completed':
            return 'Concluído';
        case 'in-progress':
            return 'Em Progresso';
        case 'on-hold':
            return 'Em Pausa';
        case 'planning':
            return 'Planejamento';
        default:
            return 'Sem Status';
    }
};

const getPriorityColor = (priority?: Project['priority']) => {
    switch (priority) {
        case 'high':
            return 'error';
        case 'medium':
            return 'warning';
        case 'low':
            return 'info';
        default:
            return 'default';
    }
};

const getPriorityLabel = (priority?: Project['priority']) => {
    switch (priority) {
        case 'high':
            return 'Alta';
        case 'medium':
            return 'Média';
        case 'low':
            return 'Baixa';
        default:
            return '';
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export function ProjectItem({ project, onEdit, onDelete, onStatusChange }: ProjectItemProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = (newStatus: Project['status']) => {
        if (onStatusChange) {
            onStatusChange(project.id, newStatus);
        }
        handleMenuClose();
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main',
                },
                transition: 'all 0.2s',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {project.name}
                    </Typography>
                    {project.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {project.description}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                            label={getStatusLabel(project.status)}
                            size="small"
                            color={getStatusColor(project.status)}
                            variant="outlined"
                        />
                        {project.priority && (
                            <Chip
                                label={getPriorityLabel(project.priority)}
                                size="small"
                                color={getPriorityColor(project.priority)}
                                variant="outlined"
                            />
                        )}
                    </Box>
                    {project.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                            Prazo: {formatDate(project.dueDate)}
                        </Typography>
                    )}
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
                    <MenuItem onClick={() => { onEdit(project); handleMenuClose(); }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    {project.status !== 'in-progress' && (
                        <MenuItem onClick={() => handleStatusChange('in-progress')}>
                            <PlayArrow fontSize="small" sx={{ mr: 1 }} />
                            Iniciar
                        </MenuItem>
                    )}
                    {project.status === 'in-progress' && (
                        <MenuItem onClick={() => handleStatusChange('on-hold')}>
                            <Pause fontSize="small" sx={{ mr: 1 }} />
                            Pausar
                        </MenuItem>
                    )}
                    {project.status !== 'completed' && (
                        <MenuItem onClick={() => handleStatusChange('completed')}>
                            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                            Concluir
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este projeto?')) {
                                onDelete(project.id);
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
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Progresso
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {project.progress}%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}

