import { Project } from '@/app/types/project';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';

interface ProjectListProps {
    projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Seus Projetos</Typography>
            {projects.map((project) => (
                <Box key={project.id} sx={{ mb: 2.5 }}>
                    <Typography variant="body1">{project.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 5 }} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${project.progress}%`}</Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Paper>
    );
}