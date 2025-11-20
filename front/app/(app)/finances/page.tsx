"use client";

import * as React from 'react';
import { 
  Box, Toolbar, Grid, Button, Typography, CircularProgress, Alert, // Importe Grid2 as Grid se estiver na v6, ou mantenha Grid se o seu setup já entende o Grid v2
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack
} from '@mui/material';
import { Add, AccountBalanceWallet } from '@mui/icons-material';
import { TopNav } from '@/app/components/layout/topnav';
import { SideNav } from '@/app/components/layout/sidenav';
import { AccountList } from '@/app/components/finances/account-list';
import { TransactionList } from '@/app/components/finances/transaction-list';
import { AdSpace } from '@/app/components/ads/ad-space';
import { useFinances } from '@/app/hooks/useFinances';

export default function FinancesPage() {
    const userName = "Usuário";
    const { accounts, transactions, loading, error, createTransaction, createAccount } = useFinances();
    const [openTransactionDialog, setOpenTransactionDialog] = React.useState(false);
    const [savingTransaction, setSavingTransaction] = React.useState(false);
    const [transactionForm, setTransactionForm] = React.useState({
        description: '',
        amount: '',
        type: 'expense' as 'income' | 'expense',
        category: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [openAccountDialog, setOpenAccountDialog] = React.useState(false);
    const [savingAccount, setSavingAccount] = React.useState(false);
    const [accountForm, setAccountForm] = React.useState({
        name: '',
        type: 'checking' as 'checking' | 'savings' | 'credit' | 'investment' | 'other',
        balance: '',
        bank: ''
    });

    const handleAddTransaction = () => {
        setTransactionForm({
            description: '',
            amount: '',
            type: 'expense',
            category: '',
            accountId: accounts.length > 0 ? String(accounts[0].id) : '',
            date: new Date().toISOString().split('T')[0]
        });
        setOpenTransactionDialog(true);
    };

    const handleSaveTransaction = async () => {
        if (!transactionForm.description || !transactionForm.amount || !transactionForm.accountId) return;
        setSavingTransaction(true);
        try {
            await createTransaction({
                description: transactionForm.description,
                amount: Number(transactionForm.amount),
                type: transactionForm.type,
                category: transactionForm.category || 'Geral',
                accountId: Number(transactionForm.accountId),
                date: transactionForm.date
            });
            setOpenTransactionDialog(false);
        } catch (err) {
            console.error(err);
            alert('Erro ao criar transação.');
        } finally {
            setSavingTransaction(false);
        }
    };

    const handleAddAccount = () => {
        setAccountForm({
            name: '',
            type: 'checking',
            balance: '0',
            bank: ''
        });
        setOpenAccountDialog(true);
    };

    const handleSaveAccount = async () => {
        if (!accountForm.name || accountForm.balance === '') return;
        setSavingAccount(true);
        try {
            await createAccount({
                name: accountForm.name,
                type: accountForm.type,
                balance: Number(accountForm.balance),
                bank: accountForm.bank
            });
            setOpenAccountDialog(false);
        } catch (err) {
            console.error(err);
            alert('Erro ao criar conta.');
        } finally {
            setSavingAccount(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <TopNav userName={userName} />
            <SideNav />

            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
                <Toolbar />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Finanças e Contas
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<AccountBalanceWallet />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleAddAccount}
                        >
                            Nova Conta
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleAddTransaction}
                        >
                            Nova Transação
                        </Button>
                    </Stack>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error.message}
                    </Alert>
                )}

                {/* CORREÇÃO AQUI: xs -> size */}
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <AccountList accounts={accounts} />
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ my: 3 }}>
                            <AdSpace size="banner" adId="finances-middle" />
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <TransactionList transactions={transactions} />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <AdSpace size="banner" adId="finances-bottom" />
                </Box>

                {/* --- DIALOG DE NOVA TRANSAÇÃO --- */}
                <Dialog 
                    open={openTransactionDialog} 
                    onClose={() => setOpenTransactionDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Nova Transação</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Descrição"
                                value={transactionForm.description}
                                onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                fullWidth
                                required
                            />
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        label="Valor (R$)"
                                        type="number"
                                        value={transactionForm.amount}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        select
                                        label="Tipo"
                                        value={transactionForm.type}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as 'income' | 'expense' })}
                                        fullWidth
                                    >
                                        <MenuItem value="expense">Despesa</MenuItem>
                                        <MenuItem value="income">Receita</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <TextField
                                select
                                label="Conta"
                                value={transactionForm.accountId}
                                onChange={(e) => setTransactionForm({ ...transactionForm, accountId: e.target.value })}
                                fullWidth
                                required
                                helperText={accounts.length === 0 ? "Crie uma conta primeiro" : ""}
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                        {account.name} (Saldo: R$ {Number(account.balance).toFixed(2)})
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        label="Categoria"
                                        value={transactionForm.category}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                                        fullWidth
                                        placeholder="Ex: Alimentação"
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="Data"
                                        type="date"
                                        value={transactionForm.date}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTransactionDialog(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
                        <Button 
                            onClick={handleSaveTransaction} 
                            variant="contained"
                            disabled={savingTransaction || !transactionForm.description || !transactionForm.amount || !transactionForm.accountId}
                            sx={{ textTransform: 'none' }}
                        >
                            {savingTransaction ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={openAccountDialog} 
                    onClose={() => setOpenAccountDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Nova Conta</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Nome da Conta"
                                value={accountForm.name}
                                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                                fullWidth
                                required
                                placeholder="Ex: NuBank, Carteira, Bradesco"
                            />
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        select
                                        label="Tipo"
                                        value={accountForm.type}
                                        onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value as any })}
                                        fullWidth
                                    >
                                        <MenuItem value="checking">Corrente</MenuItem>
                                        <MenuItem value="savings">Poupança</MenuItem>
                                        <MenuItem value="credit">Cartão de Crédito</MenuItem>
                                        <MenuItem value="investment">Investimento</MenuItem>
                                        <MenuItem value="other">Outro</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="Saldo Inicial (R$)"
                                        type="number"
                                        value={accountForm.balance}
                                        onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                label="Nome do Banco (Opcional)"
                                value={accountForm.bank}
                                onChange={(e) => setAccountForm({ ...accountForm, bank: e.target.value })}
                                fullWidth
                                placeholder="Ex: Banco do Brasil"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAccountDialog(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
                        <Button 
                            onClick={handleSaveAccount} 
                            variant="contained"
                            disabled={savingAccount || !accountForm.name || accountForm.balance === ''}
                            sx={{ textTransform: 'none' }}
                        >
                            {savingAccount ? <CircularProgress size={20} /> : 'Criar Conta'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}