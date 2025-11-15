"use client";

import * as React from 'react';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useTheme } from '@/app/contexts/ThemeContext';

export function PreferencesSection() {
    const { mode, toggleMode } = useTheme();
    const [preferences, setPreferences] = React.useState({
        compactMode: false,
        showAnimations: true,
        dateFormat: 'DD/MM/YYYY',
        currency: 'BRL',
    });

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Preferências
            </Typography>

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleMode}
                            color="primary"
                        />
                    }
                    label="Modo Escuro"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Alternar entre tema claro e escuro
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={preferences.compactMode}
                            onChange={(e) => setPreferences({ ...preferences, compactMode: e.target.checked })}
                            color="primary"
                        />
                    }
                    label="Modo Compacto"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Exibir mais informações em menos espaço
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={preferences.showAnimations}
                            onChange={(e) => setPreferences({ ...preferences, showAnimations: e.target.checked })}
                            color="primary"
                        />
                    }
                    label="Animações"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Habilitar transições e animações na interface
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Formato de Data</InputLabel>
                    <Select
                        value={preferences.dateFormat}
                        label="Formato de Data"
                        onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                    >
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl fullWidth>
                    <InputLabel>Moeda</InputLabel>
                    <Select
                        value={preferences.currency}
                        label="Moeda"
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    >
                        <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
                        <MenuItem value="USD">Dólar Americano ($)</MenuItem>
                        <MenuItem value="EUR">Euro (€)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}

