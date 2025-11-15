"use client";

import * as React from 'react';
import {
    Box,
    Paper,
    Avatar,
    Button,
    Typography,
    IconButton,
    Stack,
} from '@mui/material';
import { CameraAlt, Delete } from '@mui/icons-material';

export function ProfilePhotoSection() {
    const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione uma imagem válida');
                return;
            }

            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                return;
            }

            // Criar preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            // TODO: Fazer upload da imagem para o servidor/storage
        }
    };

    const handleRemovePhoto = () => {
        setPhotoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center',
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                    src={photoUrl || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                    }}
                >
                    {!photoUrl && 'U'}
                </Avatar>
                <IconButton
                    onClick={handleClickUpload}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        width: 36,
                        height: 36,
                    }}
                >
                    <CameraAlt fontSize="small" />
                </IconButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </Box>

            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Foto de Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                JPG, PNG ou GIF. Máximo 5MB
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CameraAlt />}
                    onClick={handleClickUpload}
                    sx={{ textTransform: 'none' }}
                >
                    {photoUrl ? 'Alterar' : 'Adicionar'}
                </Button>
                {photoUrl && (
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleRemovePhoto}
                        sx={{ textTransform: 'none' }}
                    >
                        Remover
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}

