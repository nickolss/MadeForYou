'use client';
import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { getTheme } from '../../theme';

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    const { mode } = useTheme();
    const theme = React.useMemo(() => getTheme(mode), [mode]);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider>
                <AuthProvider>
                    <ThemeProviderWrapper>
                        {children}
                    </ThemeProviderWrapper>
                </AuthProvider>
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}