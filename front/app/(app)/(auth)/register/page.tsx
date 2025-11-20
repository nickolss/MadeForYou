"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Link,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            await register(email, password);
            router.push('/');
        } catch (err: any) {
            let errorMessage = 'Erro ao criar conta. Tente novamente.';
            
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Este e-mail já está em uso.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'E-mail inválido.';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = 'Operação não permitida.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Senha muito fraca. Use uma senha mais forte.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                py: 4,
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                        <HowToRegIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography component="h1" variant="h4" color="text.primary" gutterBottom>
                        Crie sua conta
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                        Comece sua jornada de autodesenvolvimento hoje mesmo.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            autoComplete="given-name"
                            margin="normal"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="Nome"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Sobrenome"
                            name="lastName"
                            autoComplete="family-name"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Seu e-mail"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Crie uma senha"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirme a senha"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid>
                                <Link href="/login" variant="body2" color="primary">
                                    Já tem uma conta? Entre
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}