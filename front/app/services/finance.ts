import { Account, Transaction } from '../types/finance';
import { api } from './api';


interface AccountDTO {
  id: number;
  name: string;
  type: Account['type'];
  balance: number;
  bank?: string;
}

interface TransactionDTO {
  id: number;
  accountId: number;
  description: string;
  amount: number;
  type: Transaction['type'];
  category: string;
  date: string;
}

type AccountRequest = Omit<AccountDTO, 'id'>;
type TransactionRequest = Omit<TransactionDTO, 'id'>;


// --- ADAPTERS (Account) ---
function toFrontendAccount(data: AccountDTO): Account {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    balance: data.balance,
    bank: data.bank,
  };
}

function toBackendAccount(account: Partial<Account>): AccountRequest {
  return {
    name: account.name || '',
    type: account.type || 'other',
    balance: account.balance || 0,
    bank: account.bank || '',
  };
}

// --- ADAPTERS (Transaction) ---
function toFrontendTransaction(data: TransactionDTO): Transaction {
  return {
    id: data.id,
    accountId: data.accountId, 
    description: data.description,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
  };
}

function toBackendTransaction(transaction: Partial<Transaction>): TransactionRequest {
  return {
    accountId: transaction.accountId!, // Assumimos que accountId existe ao salvar
    description: transaction.description || '',
    amount: transaction.amount || 0,
    type: transaction.type || 'expense',
    category: transaction.category || 'Outros',
    date: transaction.date || new Date().toISOString().split('T')[0],
  };
}

// --- ACCOUNTS SERVICE ---

/**
 * Busca todas as contas do usuário
 * Endpoint: GET /api/finance/accounts
 */
export async function getAccounts(userId: string): Promise<Account[]> {
  try {
    // Informamos ao axios que o retorno é um array de AccountDTO
    const { data } = await api.get<AccountDTO[]>('/finance/accounts', {
      params: { userId }
    });
    return data.map(toFrontendAccount);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    throw error;
  }
}

/**
 * Cria uma nova conta
 * Endpoint: POST /api/finance/accounts
 */
export async function createAccount(
  userId: string,
  account: Omit<Account, 'id'>
): Promise<Account> {
  try {
    const payload = toBackendAccount(account);
    
    const { data } = await api.post<AccountDTO>('/finance/accounts', payload, {
      params: { userId }
    });
    
    return toFrontendAccount(data);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
}

/**
 * Atualiza uma conta
 * Endpoint: PATCH /api/finance/accounts/{id}
 */
export async function updateAccount(
  userId: string,
  accountId: number,
  updates: Partial<Account>
): Promise<Account> {
  try {
    const payload = toBackendAccount(updates);

    const { data } = await api.patch<AccountDTO>(`/finance/accounts/${accountId}`, payload, {
      params: { userId }
    });

    return toFrontendAccount(data);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    throw error;
  }
}

/**
 * Deleta uma conta
 * Endpoint: DELETE /api/finance/accounts/{id}
 */
export async function deleteAccount(
  userId: string,
  accountId: number
): Promise<void> {
  try {
    await api.delete(`/finance/accounts/${accountId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    throw error;
  }
}

// --- TRANSACTIONS SERVICE ---

/**
 * Busca todas as transações
 * Endpoint: GET /api/finance/transactions
 */
export async function getTransactions(
  userId: string,
  accountId?: number
): Promise<Transaction[]> {
  try {
    const { data } = await api.get<TransactionDTO[]>('/finance/transactions', {
      params: { 
        userId, 
        accountId
      }
    });
    return data.map(toFrontendTransaction);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw error;
  }
}

/**
 * Cria uma nova transação
 * Endpoint: POST /api/finance/transactions
 */
export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  try {
    const payload = toBackendTransaction(transaction);

    const { data } = await api.post<TransactionDTO>('/finance/transactions', payload, {
      params: { userId }
    });

    return toFrontendTransaction(data);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw error;
  }
}

/**
 * Atualiza uma transação
 * Endpoint: PATCH /api/finance/transactions/{id}
 */
export async function updateTransaction(
  userId: string,
  transactionId: number,
  updates: Partial<Transaction>
): Promise<Transaction> {
  try {
    const payload = toBackendTransaction(updates);

    const { data } = await api.patch<TransactionDTO>(`/finance/transactions/${transactionId}`, payload, {
      params: { userId }
    });

    return toFrontendTransaction(data);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
}

/**
 * Deleta uma transação
 * Endpoint: DELETE /api/finance/transactions/{id}
 */
export async function deleteTransaction(
  userId: string,
  transactionId: number
): Promise<void> {
  try {
    await api.delete(`/finance/transactions/${transactionId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    throw error;
  }
}