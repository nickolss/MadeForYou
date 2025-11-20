"use client";

import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Account, Transaction } from '../types/finance';
import * as financesService from '../services/finance';

export function useFinances() {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const refreshAccountsOnly = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const updatedAccounts = await financesService.getAccounts(currentUser.uid);
      setAccounts(updatedAccounts);
    } catch (err) {
      console.error("Erro ao atualizar saldos:", err);
    }
  }, [currentUser]);

  const loadFinances = React.useCallback(async () => {
    if (!currentUser) {
      setAccounts([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [accountsData, transactionsData] = await Promise.all([
        financesService.getAccounts(currentUser.uid),
        financesService.getTransactions(currentUser.uid),
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar finanças');
      setError(error);
      console.error('Erro ao carregar finanças:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadFinances();
  }, [loadFinances]);

  // --- ACCOUNTS ---
  const createAccount = React.useCallback(async (account: Omit<Account, 'id'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newAccount = await financesService.createAccount(currentUser.uid, account);
      setAccounts((prev) => [newAccount, ...prev]);
      return newAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar conta');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateAccount = React.useCallback(async (accountId: number, updates: Partial<Account>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedAccount = await financesService.updateAccount(currentUser.uid, accountId, updates);
      setAccounts((prev) => prev.map((a) => (a.id === accountId ? updatedAccount : a)));
      return updatedAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar conta');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const deleteAccount = React.useCallback(async (accountId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await financesService.deleteAccount(currentUser.uid, accountId);
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      // Também removemos as transações dessa conta da lista local visualmente
      setTransactions((prev) => prev.filter((t) => t.accountId !== accountId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar conta');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  // --- TRANSACTIONS ---

  const createTransaction = React.useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newTransaction = await financesService.createTransaction(currentUser.uid, transaction);
      
      setTransactions((prev) => [newTransaction, ...prev]);
      
      await refreshAccountsOnly();
      
      return newTransaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar transação');
      setError(error);
      throw error;
    }
  }, [currentUser, refreshAccountsOnly]);

  const updateTransaction = React.useCallback(async (transactionId: number, updates: Partial<Transaction>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedTransaction = await financesService.updateTransaction(currentUser.uid, transactionId, updates);
      
      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? updatedTransaction : t)));
      
      await refreshAccountsOnly();
      
      return updatedTransaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar transação');
      setError(error);
      throw error;
    }
  }, [currentUser, refreshAccountsOnly]);

  const deleteTransaction = React.useCallback(async (transactionId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await financesService.deleteTransaction(currentUser.uid, transactionId);
      
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      
      await refreshAccountsOnly();

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar transação');
      setError(error);
      throw error;
    }
  }, [currentUser, refreshAccountsOnly]);

  return {
    accounts,
    transactions,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshFinances: loadFinances,
  };
}