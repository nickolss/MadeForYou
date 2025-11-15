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
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function RegisterPage() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');

        if (password !== confirmPassword) {
            console.error("As senhas não coincidem!");
            return;
        }

        console.log({
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
        });
        // TODO: Chamar o Firebase Auth para criar um novo usuário com e-mail e senha.
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
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Criar Conta
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