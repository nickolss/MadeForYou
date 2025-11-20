import { Paper, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Transaction } from '@/app/types/finance';

interface TransactionListProps {
    transactions: Transaction[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
};

export function TransactionList({ transactions }: TransactionListProps) {
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Transações Recentes
            </Typography>
            {sortedTransactions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    Nenhuma transação registrada
                </Typography>
            ) : (
                <List>
                    {sortedTransactions.map((transaction) => {
                        const isIncome = transaction.type === 'income';
                        const colorMain = isIncome ? 'success.main' : 'error.main';

                        return (
                            <ListItem
                                key={transaction.id}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' },
                                    px: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: (theme) => alpha(theme.palette[isIncome ? 'success' : 'error'].main, 0.1),
                                        color: colorMain,
                                        mr: 2,
                                    }}
                                >
                                    {isIncome ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                                </Box>

                                <ListItemText
                                    primary={transaction.description}
                                    slotProps={{
                                        secondary: {
                                            component: 'div'
                                        }
                                    }}
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <Chip
                                                label={transaction.category}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem', '& .MuiChip-label': { px: 1 } }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(transaction.date)}
                                            </Typography>
                                        </Box>
                                    }
                                />

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: colorMain,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {isIncome ? '+' : '-'}
                                    {formatCurrency(Math.abs(transaction.amount))}
                                </Typography>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Paper>
    );
}