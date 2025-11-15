import { Task } from '@/app/types';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
    IconButton,
    Chip,
    Box,
    Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

const getPriorityColor = (priority?: Task['priority']) => {
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

const getPriorityLabel = (priority?: Task['priority']) => {
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
    }).format(date);
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
    return (
        <ListItem
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                    borderBottom: 'none',
                },
            }}
        >
            <ListItemButton onClick={() => onToggle(task.id)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={task.completed}
                        disableRipple
                        sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                                color: 'success.main',
                            },
                        }}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? 'text.secondary' : 'text.primary',
                                    flexGrow: 1,
                                }}
                            >
                                {task.text}
                            </Typography>
                            {task.priority && (
                                <Chip
                                    label={getPriorityLabel(task.priority)}
                                    size="small"
                                    color={getPriorityColor(task.priority)}
                                    variant="outlined"
                                />
                            )}
                            {task.category && (
                                <Chip
                                    label={task.category}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {task.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(task.dueDate)}
                                </Typography>
                            )}
                        </Box>
                    }
                />
            </ListItemButton>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                    sx={{ color: 'text.secondary' }}
                >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Box>
        </ListItem>
    );
}

