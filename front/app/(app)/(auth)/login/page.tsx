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
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            let errorMessage = 'Erro ao fazer login. Tente novamente.';
            
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'E-mail inválido.';
            } else if (err.code === 'auth/user-disabled') {
                errorMessage = 'Esta conta foi desabilitada.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado.';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Senha incorreta.';
            } else if (err.code === 'auth/invalid-credential') {
                errorMessage = 'E-mail ou senha incorretos.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
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
                        <TrackChangesIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography component="h1" variant="h4" color="text.primary" gutterBottom>
                        Bem-vindo(a) de volta
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Acesse para continuar sua jornada.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Seu e-mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Sua senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Continuar'}
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid>
                                <Link href="#" variant="body2" color="primary">
                                    Esqueceu a senha?
                                </Link>
                            </Grid>
                            <Grid>
                                <Link href="/register" variant="body2" color="primary">
                                    Criar uma conta
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}