"use client";

import * as React from 'react';
import { Box, Toolbar, Typography,Grid, Paper } from '@mui/material';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { ProfilePhotoSection } from '@/app/components/profile/profile-photo-section';
import { PersonalInfoSection } from '@/app/components/profile/personal-info-section';
import { AccountSettingsSection } from '@/app/components/profile/account-settings-section';
import { SecuritySection } from '@/app/components/profile/security-section';
import { PreferencesSection } from '@/app/components/profile/preferences-section';

export default function ProfilePage() {
    const userName = "Usuário";

    return (
        <Box sx={{ display: 'flex' }}>
            <TopNav userName={userName} />
            <SideNav />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}
            >
                <Toolbar />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Meu Perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie suas informações pessoais e configurações da conta
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ProfilePhotoSection />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 3,
                            }}
                        >
                            <PersonalInfoSection />
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 3,
                            }}
                        >
                            <AccountSettingsSection />
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 3,
                            }}
                        >
                            <SecuritySection />
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}
                        >
                            <PreferencesSection />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}