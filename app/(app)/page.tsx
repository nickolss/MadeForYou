"use client";

import * as React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Project, Task, Account, Transaction, Habit, HabitEntry, Note } from '../types';
import { TopNav } from '../components/layout/topnav';
import { SideNav } from '../components/layout/sidenav';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { DashboardOverview } from '../components/dashboard/dashboard-overview';
import { QuickTasks } from '../components/dashboard/quick-tasks';
import { QuickProjects } from '../components/dashboard/quick-projects';
import { QuickHabits } from '../components/dashboard/quick-habits';
import { QuickNotes } from '../components/dashboard/quick-notes';
import { AdSpace } from '../components/ads/ad-space';

const mockTasks: Task[] = [
  { id: 1, text: 'Finalizar o relatório de marketing', completed: false, priority: 'high' },
  { id: 2, text: 'Agendar consulta com o dentista', completed: true, priority: 'medium' },
  { id: 3, text: 'Revisar a proposta do projeto "Orion"', completed: false, priority: 'high' },
  { id: 4, text: 'Ler 1 capítulo do livro "Hábitos Atômicos"', completed: false, priority: 'low' },
  { id: 5, text: 'Comprar presentes de aniversário', completed: false, priority: 'medium' },
];

const mockProjects: Project[] = [
  { id: 1, name: 'Lançamento do Produto X', progress: 75, status: 'in-progress', priority: 'high' },
  { id: 2, name: 'Reforma do Apartamento', progress: 40, status: 'in-progress', priority: 'medium' },
  { id: 3, name: 'Plano de Estudos para Certificação', progress: 60, status: 'in-progress', priority: 'high' },
];

const mockAccounts: Account[] = [
  { id: 1, name: 'Conta Principal', type: 'checking', balance: 5000.00, bank: 'Banco do Brasil' },
  { id: 2, name: 'Poupança', type: 'savings', balance: 15000.00, bank: 'Banco do Brasil' },
];

const mockTransactions: Transaction[] = [
  { id: 1, accountId: 1, description: 'Salário', amount: 5000.00, type: 'income', category: 'Salário', date: '2024-01-15' },
  { id: 2, accountId: 1, description: 'Compras Supermercado', amount: 350.00, type: 'expense', category: 'Alimentação', date: '2024-01-14' },
];

const mockHabits: Habit[] = [
  { id: 1, name: 'Exercitar-se', color: '#10b981', frequency: 'daily', createdAt: '2024-01-01' },
  { id: 2, name: 'Ler', color: '#6366f1', frequency: 'daily', createdAt: '2024-01-05' },
  { id: 3, name: 'Meditar', color: '#f59e0b', frequency: 'daily', createdAt: '2024-01-10' },
];

const mockHabitEntries: HabitEntry[] = [
  { id: 1, habitId: 1, date: new Date().toISOString().split('T')[0], completed: true },
  { id: 2, habitId: 2, date: new Date().toISOString().split('T')[0], completed: false },
];

const mockNotes: Note[] = [
  {
    id: 1,
    title: 'Ideias para o projeto',
    content: 'Preciso pensar em melhorias para o sistema de gestão.',
    category: 'Trabalho',
    isPinned: true,
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00',
    color: '#6366f1',
  },
  {
    id: 2,
    title: 'Reflexão do dia',
    content: 'Hoje foi um dia produtivo. Consegui finalizar várias tarefas importantes.',
    category: 'Pessoal',
    isPinned: false,
    createdAt: '2024-01-15T18:30:00',
    updatedAt: '2024-01-15T18:30:00',
  },
];

export default function HomePage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const userName = "Usuário";

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const projectsTotal = mockProjects.length;
  const projectsInProgress = mockProjects.filter(p => p.status === 'in-progress').length;
  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = mockTransactions.length;

  return (
    <Box sx={{ display: 'flex' }}>
      <TopNav userName={userName} />
      <SideNav />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}
      >
        <Toolbar />

        <DashboardHeader userName={userName} />

        <DashboardOverview
          tasksTotal={tasksTotal}
          tasksCompleted={tasksCompleted}
          projectsTotal={projectsTotal}
          projectsInProgress={projectsInProgress}
          totalBalance={totalBalance}
          recentTransactions={recentTransactions}
        />

        <Box sx={{ mb: 3 }}>
          <AdSpace size="banner" adId="dashboard-top" />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickTasks tasks={tasks} onToggleTask={handleToggleTask} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickProjects projects={mockProjects} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickHabits habits={mockHabits} entries={mockHabitEntries} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickNotes notes={mockNotes} />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <AdSpace size="banner" adId="dashboard-bottom" />
        </Box>
      </Box>
    </Box>
  );
}