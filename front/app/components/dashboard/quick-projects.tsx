import { Project } from '@/app/types/project';
import { Paper, Typography, Box, LinearProgress, Button } from '@mui/material';
import Link from 'next/link';

interface QuickProjectsProps {
    projects: Project[];
}

export function QuickProjects({ projects }: QuickProjectsProps) {
    const activeProjects = projects
        .filter(p => p.status === 'in-progress')
        .slice(0, 3);

    return (
        <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Projetos em Progresso
                </Typography>
                <Button
                    component={Link}
                    href="/projects"
                    size="small"
                    sx={{ textTransform: 'none' }}
                >
                    Ver todos →
                </Button>
            </Box>
            {activeProjects.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Nenhum projeto em progresso
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {activeProjects.map((project) => (
                        <Box key={project.id} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                {project.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={project.progress}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {project.progress}%
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

