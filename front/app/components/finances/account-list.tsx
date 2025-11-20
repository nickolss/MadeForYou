import { Paper, Typography, Box, Chip, Grid } from '@mui/material';
import { AccountBalance, CreditCard, Savings, TrendingUp, AccountBalanceWallet } from '@mui/icons-material';
import { Account } from '@/app/types/finance';

interface AccountListProps {
    accounts: Account[];
}

const getAccountIcon = (type: Account['type']) => {
    switch (type) {
        case 'checking':
            return <AccountBalance />;
        case 'savings':
            return <Savings />;
        case 'credit':
            return <CreditCard />;
        case 'investment':
            return <TrendingUp />;
        default:
            return <AccountBalanceWallet />;
    }
};

const getAccountTypeLabel = (type: Account['type']) => {
    switch (type) {
        case 'checking':
            return 'Conta Corrente';
        case 'savings':
            return 'Poupança';
        case 'credit':
            return 'Cartão de Crédito';
        case 'investment':
            return 'Investimento';
        default:
            return 'Outro';
    }
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export function AccountList({ accounts }: AccountListProps) {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Minhas Contas</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatCurrency(totalBalance)}
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {accounts.map((account) => (
                    <Grid key={account.id}>
                        <Box
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ color: 'primary.main', mr: 1 }}>
                                    {getAccountIcon(account.type)}
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {account.name}
                                </Typography>
                            </Box>
                            {account.bank && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    {account.bank}
                                </Typography>
                            )}
                            <Chip
                                label={getAccountTypeLabel(account.type)}
                                size="small"
                                sx={{ mb: 1 }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: account.balance >= 0 ? 'success.main' : 'error.main',
                                }}
                            >
                                {formatCurrency(account.balance)}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

