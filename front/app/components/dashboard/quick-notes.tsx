import { Paper, Typography, Box, Button } from '@mui/material';
import { Note as NoteIcon, PushPin } from '@mui/icons-material';
import Link from 'next/link';
import { Note } from '@/app/types/note';

interface QuickNotesProps {
    notes: Note[];
}

export function QuickNotes({ notes }: QuickNotesProps) {
    const recentNotes = notes
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    return (
        <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Notas Recentes
                </Typography>
                <Button
                    component={Link}
                    href="/notes"
                    size="small"
                    sx={{ textTransform: 'none' }}
                >
                    Ver todas →
                </Button>
            </Box>

            {recentNotes.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                    <NoteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                        Nenhuma nota ainda
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {recentNotes.map((note) => (
                        <Box
                            key={note.id}
                            component={Link}
                            href="/notes"
                            sx={{
                                display: 'block',
                                p: 1.5,
                                mb: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': {
                                    borderColor: note.color || 'primary.main',
                                    backgroundColor: 'action.hover',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                {note.isPinned && (
                                    <PushPin fontSize="small" sx={{ color: 'warning.main' }} />
                                )}
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 'bold',
                                        flexGrow: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {note.title}
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {note.content}
                            </Typography>
                            {note.category && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    {note.category}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

