import { Project } from '@/app/types';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { ProjectItem } from './project-item';

interface ProjectListEnhancedProps {
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: number) => void;
    onStatusChange?: (id: number, status: Project['status']) => void;
    title?: string;
}

export function ProjectListEnhanced({
    projects,
    onEditProject,
    onDeleteProject,
    onStatusChange,
    title = 'Projetos',
}: ProjectListEnhancedProps) {
    if (projects.length === 0) {
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
                        Nenhum projeto encontrado
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {title} ({projects.length})
            </Typography>
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <ProjectItem
                            project={project}
                            onEdit={onEditProject}
                            onDelete={onDeleteProject}
                            onStatusChange={onStatusChange}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

