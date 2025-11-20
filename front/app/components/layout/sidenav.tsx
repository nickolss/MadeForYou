import { Drawer, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, Box, Divider } from '@mui/material';
import { Home, CheckCircleOutline, AccountTree, AccountBalance, Psychology, Note, Person } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdSpace } from '../ads/ad-space';

export const drawerWidth = 240;

const navItems = [
    { text: 'Início', icon: <Home />, path: '/' },
    { text: 'Minhas Tarefas', icon: <CheckCircleOutline />, path: '/tasks' },
    { text: 'Projetos', icon: <AccountTree />, path: '/projects' },
    { text: 'Hábitos', icon: <Psychology />, path: '/habits' },
    { text: 'Notas', icon: <Note />, path: '/notes' },
    { text: 'Finanças', icon: <AccountBalance />, path: '/finances' },
];

const profileItem = { text: 'Meu Perfil', icon: <Person />, path: '/profile' };

export function SideNav() {
    const theme = useTheme();
    const pathname = usePathname();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        background: isDark 
                            ? 'linear-gradient(135deg, #818cf8 0%, #34d399 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    MadeForYou
                </Typography>
            </Toolbar>
            <List sx={{ flexGrow: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton 
                                component={Link}
                                href={item.path}
                                sx={{ 
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    '&:hover': { 
                                        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                                    },
                                    ...(isActive && {
                                        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                                    }),
                                    color: isActive ? 'primary.main' : 'text.primary',
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        color: isActive ? 'primary.main' : 'text.primary',
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton 
                        component={Link}
                        href={profileItem.path}
                        sx={{ 
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            '&:hover': { 
                                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                            },
                            ...(pathname === profileItem.path && {
                                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                                borderLeft: `3px solid ${theme.palette.primary.main}`,
                            }),
                            color: pathname === profileItem.path ? 'primary.main' : 'text.primary',
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: pathname === profileItem.path ? 'primary.main' : 'text.secondary',
                                minWidth: 40,
                            }}
                        >
                            {profileItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={profileItem.text}
                            primaryTypographyProps={{
                                color: pathname === profileItem.path ? 'primary.main' : 'text.primary',
                                fontWeight: pathname === profileItem.path ? 600 : 400,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
            <Box sx={{ p: 2, mt: 'auto' }}>
                <AdSpace size="sidebar" adId="sidebar-main" />
            </Box>
        </Drawer>
    );
}