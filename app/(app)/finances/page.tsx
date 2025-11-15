"use client";

import * as React from 'react';
import { Box, Toolbar, Grid, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Account, Transaction } from '@/app/types';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { AccountList } from '@/app/components/finances/account-list';
import { TransactionList } from '@/app/components/finances/transaction-list';
import { AdSpace } from '@/app/components/ads/ad-space';

const mockAccounts: Account[] = [
    { id: 1, name: 'Conta Principal', type: 'checking', balance: 5000.00, bank: 'Banco do Brasil' },
    { id: 2, name: 'Poupança', type: 'savings', balance: 15000.00, bank: 'Banco do Brasil' },
    { id: 3, name: 'Cartão Nubank', type: 'credit', balance: -1200.50, bank: 'Nubank' },
    { id: 4, name: 'Investimentos', type: 'investment', balance: 25000.00, bank: 'Rico' },
];

const mockTransactions: Transaction[] = [
    {
        id: 1,
        accountId: 1,
        description: 'Salário',
        amount: 5000.00,
        type: 'income',
        category: 'Salário',
        date: '2024-01-15',
    },
    {
        id: 2,
        accountId: 3,
        description: 'Compras Supermercado',
        amount: 350.00,
        type: 'expense',
        category: 'Alimentação',
        date: '2024-01-14',
    },
    {
        id: 3,
        accountId: 1,
        description: 'Conta de Luz',
        amount: 180.50,
        type: 'expense',
        category: 'Utilidades',
        date: '2024-01-13',
    },
    {
        id: 4,
        accountId: 1,
        description: 'Freelance Design',
        amount: 1200.00,
        type: 'income',
        category: 'Trabalho',
        date: '2024-01-12',
    },
    {
        id: 5,
        accountId: 2,
        description: 'Transferência para Poupança',
        amount: 1000.00,
        type: 'expense',
        category: 'Transferência',
        date: '2024-01-10',
    },
];

export default function FinancesPage() {
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Finanças e Contas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ textTransform: 'none' }}
                    >
                        Nova Transação
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AccountList accounts={mockAccounts} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ my: 3 }}>
                            <AdSpace size="banner" adId="finances-middle" />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TransactionList transactions={mockTransactions} />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <AdSpace size="banner" adId="finances-bottom" />
                </Box>
            </Box>
        </Box>
    );
}

