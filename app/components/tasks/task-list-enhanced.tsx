import { Task } from '@/app/types';
import { Paper, Typography, List, Box } from '@mui/material';
import { TaskItem } from './task-item';

interface TaskListEnhancedProps {
    tasks: Task[];
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    onEditTask: (task: Task) => void;
    title?: string;
}

export function TaskListEnhanced({
    tasks,
    onToggleTask,
    onDeleteTask,
    onEditTask,
    title = 'Tarefas',
}: TaskListEnhancedProps) {
    if (tasks.length === 0) {
        return (
            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Box
                    sx={{
                        py: 6,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Nenhuma tarefa encontrada
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title} ({tasks.length})
            </Typography>
            <List>
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                    />
                ))}
            </List>
        </Paper>
    );
}

