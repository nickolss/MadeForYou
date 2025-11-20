"use client";

import * as React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

export function SecuritySection() {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
        setError(null);
        setSuccess(false);
    };

    const handleSubmitPassword = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // TODO: Atualizar senha no backend
        console.log('Alterando senha...');
        setSuccess(true);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lock sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Segurança
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
                    Senha alterada com sucesso!
                </Alert>
            )}

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Alterar Senha
            </Typography>

            <TextField
                fullWidth
                label="Senha Atual"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                edge="end"
                            >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                label="Nova Senha"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                            >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                label="Confirmar Nova Senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                variant="contained"
                onClick={handleSubmitPassword}
                sx={{ textTransform: 'none' }}
            >
                Alterar Senha
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Sessões Ativas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Você está logado neste dispositivo
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: 'none' }}
                    onClick={() => {
                        // TODO: Implementar logout de todos os dispositivos
                        console.log('Fazendo logout de todos os dispositivos...');
                    }}
                >
                    Encerrar Todas as Sessões
                </Button>
            </Box>
        </Box>
    );
}

