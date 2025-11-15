"use client";

import * as React from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Link,
    Paper,
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

export default function LoginPage() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            senha: data.get('password'),
        });

        // TODO: Autenticação com firebase
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
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Continuar
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