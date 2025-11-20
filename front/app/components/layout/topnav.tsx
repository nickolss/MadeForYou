import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { NotificationsNone, LightMode, DarkMode } from '@mui/icons-material';
import { drawerWidth } from './sidenav';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';

interface TopNavProps {
    userName: string;
}

export function TopNav({ userName }: TopNavProps) {
    const { mode, toggleMode } = useTheme();

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                backdropFilter: 'blur(10px)',
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                    Dashboard
                </Typography>
                <IconButton 
                    onClick={toggleMode}
                    sx={{ color: 'text.secondary' }}
                    aria-label="Alternar tema"
                >
                    {mode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
                <IconButton sx={{ color: 'text.secondary' }}>
                    <NotificationsNone />
                </IconButton>
                <IconButton
                    component={Link}
                    href="/profile"
                    sx={{ ml: 1 }}
                >
                    <Avatar sx={{ bgcolor: 'primary.main', cursor: 'pointer' }}>
                        {userName.charAt(0)}
                    </Avatar>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}