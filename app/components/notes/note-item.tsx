import { Note } from '@/app/types';
import {
    Paper,
    Typography,
    Box,
    IconButton,
    Chip,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert, Edit, Delete, PushPin, PushPinOutlined } from '@mui/icons-material';
import * as React from 'react';

interface NoteItemProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
    onTogglePin: (id: number) => void;
    onClick: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ontem';
    } else {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        }).format(date);
    }
};

const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export function NoteItem({ note, onEdit, onDelete, onTogglePin, onClick }: NoteItemProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: note.isPinned ? '4px solid' : '1px solid',
                borderLeftColor: note.isPinned ? (note.color || 'warning.main') : 'divider',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: note.color || 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                },
                transition: 'all 0.2s',
                backgroundColor: note.color ? `${note.color}05` : 'transparent',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {note.isPinned && (
                            <PushPin fontSize="small" sx={{ color: 'warning.main' }} />
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                            {note.title}
                        </Typography>
                    </Box>
                    {note.category && (
                        <Chip
                            label={note.category}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1, mr: 1 }}
                        />
                    )}
                    {note.tags && note.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {note.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            ))}
                        </Box>
                    )}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {truncateText(note.content)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(note.updatedAt)}
                    </Typography>
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
                    <MenuItem onClick={() => { onTogglePin(note.id); handleMenuClose(); }}>
                        {note.isPinned ? (
                            <>
                                <PushPinOutlined fontSize="small" sx={{ mr: 1 }} />
                                Desafixar
                            </>
                        ) : (
                            <>
                                <PushPin fontSize="small" sx={{ mr: 1 }} />
                                Fixar
                            </>
                        )}
                    </MenuItem>
                    <MenuItem onClick={() => { onEdit(note); handleMenuClose(); }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta nota?')) {
                                onDelete(note.id);
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
        </Paper>
    );
}

