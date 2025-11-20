import { Task } from '@/app/types/task';
import { Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText } from '@mui/material';

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: number) => void;
}

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Foco do Dia</Typography>
            <List>
                {tasks.map((task) => (
                    <ListItem key={task.id} disablePadding>
                        <ListItemButton onClick={() => onToggleTask(task.id)}>
                            <ListItemIcon>
                                <Checkbox edge="start" checked={task.completed} disableRipple />
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
        </Paper>
    );
}