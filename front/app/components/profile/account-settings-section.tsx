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
    TextField,
} from '@mui/material';

export function AccountSettingsSection() {
    const [settings, setSettings] = React.useState({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
    });

    const handleToggle = (setting: keyof typeof settings) => {
        if (typeof settings[setting] === 'boolean') {
            setSettings({ ...settings, [setting]: !settings[setting] });
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Configurações da Conta
            </Typography>

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle('emailNotifications')}
                            color="primary"
                        />
                    }
                    label="Notificações por E-mail"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Receba notificações importantes por e-mail
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.pushNotifications}
                            onChange={() => handleToggle('pushNotifications')}
                            color="primary"
                        />
                    }
                    label="Notificações Push"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Receba notificações no navegador
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.marketingEmails}
                            onChange={() => handleToggle('marketingEmails')}
                            color="primary"
                        />
                    }
                    label="E-mails de Marketing"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    Receba dicas, novidades e ofertas especiais
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                        value={settings.language}
                        label="Idioma"
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                        <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                        <MenuItem value="en-US">English (US)</MenuItem>
                        <MenuItem value="es-ES">Español</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl fullWidth>
                    <InputLabel>Fuso Horário</InputLabel>
                    <Select
                        value={settings.timezone}
                        label="Fuso Horário"
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    >
                        <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
                        <MenuItem value="America/Manaus">Manaus (GMT-4)</MenuItem>
                        <MenuItem value="America/Rio_Branco">Rio Branco (GMT-5)</MenuItem>
                        <MenuItem value="America/Noronha">Fernando de Noronha (GMT-2)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}

