"use client";

import * as React from 'react';
import { Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import { Add, PushPin } from '@mui/icons-material';
import { Note } from '@/app/types';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { NoteStats } from '@/app/components/notes/note-stats';
import { NoteFilters } from '@/app/components/notes/note-filters';
import { NoteListEnhanced } from '@/app/components/notes/note-list-enhanced';

const mockNotes: Note[] = [
    {
        id: 1,
        title: 'Ideias para o projeto',
        content: 'Preciso pensar em melhorias para o sistema de gestão. Talvez adicionar um dashboard mais interativo e relatórios em tempo real.',
        category: 'Trabalho',
        tags: ['projeto', 'ideias'],
        isPinned: true,
        createdAt: '2024-01-15T10:00:00',
        updatedAt: '2024-01-15T10:00:00',
        color: '#6366f1',
    },
    {
        id: 2,
        title: 'Reflexão do dia',
        content: 'Hoje foi um dia produtivo. Consegui finalizar várias tarefas importantes e me sinto mais organizado.',
        category: 'Pessoal',
        tags: ['reflexão', 'diário'],
        isPinned: false,
        createdAt: '2024-01-15T18:30:00',
        updatedAt: '2024-01-15T18:30:00',
    },
    {
        id: 3,
        title: 'Lista de compras',
        content: '- Leite\n- Pão\n- Frutas\n- Verduras\n- Carne',
        category: 'Compras',
        tags: ['compras'],
        isPinned: false,
        createdAt: '2024-01-14T09:00:00',
        updatedAt: '2024-01-14T09:00:00',
    },
    {
        id: 4,
        title: 'Metas para este mês',
        content: '1. Finalizar o curso de React\n2. Ler 2 livros\n3. Exercitar-se 4x por semana\n4. Economizar R$ 500',
        category: 'Metas',
        tags: ['metas', 'planejamento'],
        isPinned: true,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00',
        color: '#10b981',
    },
];

export default function NotesPage() {
    const userName = "Usuário";
    const [notes, setNotes] = React.useState<Note[]>(mockNotes);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [viewingNote, setViewingNote] = React.useState<Note | null>(null);
    const [editingNote, setEditingNote] = React.useState<Note | null>(null);
    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: '',
        color: '#6366f1',
        isPinned: false,
    });

    const categories = React.useMemo(() => {
        const cats = new Set(notes.map(n => n.category).filter(Boolean) as string[]);
        return Array.from(cats);
    }, [notes]);

    const handleNoteClick = (note: Note) => {
        setViewingNote(note);
        setOpenDialog(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setViewingNote(null);
        setFormData({
            title: note.title,
            content: note.content,
            category: note.category || '',
            tags: note.tags?.join(', ') || '',
            color: note.color || '#6366f1',
            isPinned: note.isPinned || false,
        });
        setOpenDialog(true);
    };

    const handleAddNote = () => {
        setEditingNote(null);
        setViewingNote(null);
        setFormData({
            title: '',
            content: '',
            category: '',
            tags: '',
            color: '#6366f1',
            isPinned: false,
        });
        setOpenDialog(true);
    };

    const handleSaveNote = () => {
        if (!formData.title.trim() || !formData.content.trim()) return;

        const now = new Date().toISOString();
        const tagsArray = formData.tags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        if (editingNote) {
            setNotes(notes.map(note =>
                note.id === editingNote.id
                    ? {
                          ...note,
                          title: formData.title,
                          content: formData.content,
                          category: formData.category || undefined,
                          tags: tagsArray.length > 0 ? tagsArray : undefined,
                          color: formData.color,
                          isPinned: formData.isPinned,
                          updatedAt: now,
                      }
                    : note
            ));
        } else {
            const newNote: Note = {
                id: Math.max(...notes.map(n => n.id), 0) + 1,
                title: formData.title,
                content: formData.content,
                category: formData.category || undefined,
                tags: tagsArray.length > 0 ? tagsArray : undefined,
                color: formData.color,
                isPinned: formData.isPinned,
                createdAt: now,
                updatedAt: now,
            };
            setNotes([newNote, ...notes]);
        }
        setOpenDialog(false);
    };

    const handleDeleteNote = (noteId: number) => {
        setNotes(notes.filter(note => note.id !== noteId));
    };

    const handleTogglePin = (noteId: number) => {
        setNotes(notes.map(note =>
            note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
        ));
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch =
            searchQuery === '' ||
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
            selectedCategory === null || note.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Separar notas fixadas
    const sortedNotes = [
        ...filteredNotes.filter(n => n.isPinned),
        ...filteredNotes.filter(n => !n.isPinned),
    ];

    const stats = {
        total: notes.length,
        pinned: notes.filter(n => n.isPinned).length,
        categories: categories.length,
        recent: notes.filter(n => {
            const noteDate = new Date(n.updatedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return noteDate >= weekAgo;
        }).length,
    };

    const isViewMode = viewingNote !== null && editingNote === null;

    return (
        <Box sx={{ display: 'flex' }}>
            <TopNav userName={userName} />
            <SideNav />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}
            >
                <Toolbar />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Minhas Notas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddNote}
                        sx={{ textTransform: 'none' }}
                    >
                        Nova Nota
                    </Button>
                </Box>

                <NoteStats {...stats} />

                <NoteFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <NoteListEnhanced
                            notes={sortedNotes}
                            onEditNote={handleEditNote}
                            onDeleteNote={handleDeleteNote}
                            onTogglePin={handleTogglePin}
                            onNoteClick={handleNoteClick}
                        />
                    </Grid>
                </Grid>

                <Dialog
                    open={openDialog}
                    onClose={() => {
                        setOpenDialog(false);
                        setViewingNote(null);
                        setEditingNote(null);
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {isViewMode ? viewingNote?.title : editingNote ? 'Editar Nota' : 'Nova Nota'}
                    </DialogTitle>
                    <DialogContent>
                        {isViewMode ? (
                            <Box sx={{ pt: 1 }}>
                                {viewingNote?.category && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Categoria: {viewingNote.category}
                                        </Typography>
                                    </Box>
                                )}
                                {viewingNote?.tags && viewingNote.tags.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                                        {viewingNote.tags.map((tag) => (
                                            <Typography
                                                key={tag}
                                                variant="caption"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    backgroundColor: 'action.hover',
                                                }}
                                            >
                                                {tag}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        minHeight: 200,
                                    }}
                                >
                                    {viewingNote?.content}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                    Criada em: {new Date(viewingNote?.createdAt || '').toLocaleString('pt-BR')}
                                    {viewingNote?.updatedAt !== viewingNote?.createdAt && (
                                        <> • Atualizada em: {new Date(viewingNote?.updatedAt || '').toLocaleString('pt-BR')}</>
                                    )}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                                <TextField
                                    label="Título"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Conteúdo"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    fullWidth
                                    required
                                    multiline
                                    rows={10}
                                    sx={{ fontFamily: 'monospace' }}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Categoria"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            fullWidth
                                            placeholder="Ex: Trabalho, Pessoal, Ideias..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Tags (separadas por vírgula)"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            fullWidth
                                            placeholder="Ex: projeto, ideias, importante"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Cor"
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                            <Button
                                                variant={formData.isPinned ? 'contained' : 'outlined'}
                                                onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
                                                startIcon={<PushPin />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                {formData.isPinned ? 'Fixada' : 'Fixar'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {isViewMode ? (
                            <>
                                <Button
                                    onClick={() => {
                                        if (viewingNote) {
                                            handleEditNote(viewingNote);
                                        }
                                    }}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOpenDialog(false);
                                        setViewingNote(null);
                                    }}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Fechar
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        setOpenDialog(false);
                                        setEditingNote(null);
                                    }}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSaveNote}
                                    variant="contained"
                                    disabled={!formData.title.trim() || !formData.content.trim()}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {editingNote ? 'Salvar' : 'Criar'}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

