import { Box, Typography } from '@mui/material';

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Bom dia, {userName}!
                </Typography>
                <Typography color="text.secondary">Aqui está um resumo do seu dia.</Typography>
            </Box>
        </Box>
    );
}