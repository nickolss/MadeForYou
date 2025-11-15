import { Task } from '@/app/types';
import { Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText, Box, Button } from '@mui/material';
import Link from 'next/link';

interface QuickTasksProps {
    tasks: Task[];
    onToggleTask: (id: number) => void;
}

export function QuickTasks({ tasks, onToggleTask }: QuickTasksProps) {
    const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);

    return (
        <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tarefas Pendentes
                </Typography>
                <Button
                    component={Link}
                    href="/tasks"
                    size="small"
                    sx={{ textTransform: 'none' }}
                >
                    Ver todas →
                </Button>
            </Box>
            {pendingTasks.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Nenhuma tarefa pendente
                    </Typography>
                </Box>
            ) : (
                <List>
                    {pendingTasks.map((task) => (
                        <ListItem key={task.id} disablePadding>
                            <ListItemButton onClick={() => onToggleTask(task.id)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={task.completed}
                                        disableRipple
                                        size="small"
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={task.text}
                                    sx={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'text.secondary' : 'text.primary',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}

