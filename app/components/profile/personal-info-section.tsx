"use client";

import * as React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

export function PersonalInfoSection() {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: 'Nickolas',
        lastName: 'Araújo',
        email: 'nickolas@example.com',
        phone: '(11) 99999-9999',
        bio: 'Desenvolvedor apaixonado por criar soluções que fazem a diferença.',
    });

    const handleSave = () => {
        // TODO: Salvar dados no backend
        console.log('Salvando dados:', formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // TODO: Restaurar dados originais do backend
        setIsEditing(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informações Pessoais
                </Typography>
                {!isEditing ? (
                    <IconButton
                        onClick={() => setIsEditing(true)}
                        sx={{ color: 'primary.main' }}
                    >
                        <Edit />
                    </IconButton>
                ) : (
                    <Box>
                        <IconButton
                            onClick={handleCancel}
                            sx={{ color: 'text.secondary', mr: 1 }}
                        >
                            <Cancel />
                        </IconButton>
                        <IconButton
                            onClick={handleSave}
                            sx={{ color: 'primary.main' }}
                        >
                            <Save />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        fullWidth
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Sobrenome"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        fullWidth
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="E-mail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        fullWidth
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                        placeholder="(00) 00000-0000"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Biografia"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                        placeholder="Conte um pouco sobre você..."
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

