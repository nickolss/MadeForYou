"use client";

import * as React from 'react';
import { Box, Toolbar, CircularProgress } from '@mui/material';
import { TopNav } from '../components/layout/topnav';
import { SideNav } from '../components/layout/sidenav';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { DashboardOverview } from '../components/dashboard/dashboard-overview';
import { QuickTasks } from '../components/dashboard/quick-tasks';
import { QuickProjects } from '../components/dashboard/quick-projects';
import { QuickHabits } from '../components/dashboard/quick-habits';
import { QuickNotes } from '../components/dashboard/quick-notes';
import { AdSpace } from '../components/ads/ad-space';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useHabits } from '../hooks/useHabits';
import { useNotes } from '../hooks/useNotes';
import { useFinances } from '../hooks/useFinances';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { tasks, loading: tasksLoading, updateTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { habits, entries, loading: habitsLoading } = useHabits();
  const { notes, loading: notesLoading } = useNotes();
  const { accounts, transactions, loading: financesLoading } = useFinances();

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Usuário";

  const handleToggleTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        await updateTask(taskId, { completed: !task.completed });
      } catch (err) {
        console.error('Erro ao atualizar tarefa:', err);
      }
    }
  };

  // Calcular estatísticas
  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const projectsTotal = projects.length;
  const projectsInProgress = projects.filter(p => p.status === 'in-progress').length;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transactionDate >= weekAgo;
  }).length;

  // Pegar apenas as primeiras 5 tarefas pendentes
  const recentTasks = tasks.filter(t => !t.completed).slice(0, 5);
  
  // Pegar apenas os primeiros 3 projetos em progresso
  const recentProjects = projects.filter(p => p.status === 'in-progress').slice(0, 3);
  
  // Pegar apenas os primeiros 3 hábitos
  const recentHabits = habits.slice(0, 3);
  
  // Pegar apenas as primeiras 3 notas (priorizando fixadas)
  const sortedNotes = [
    ...notes.filter(n => n.isPinned),
    ...notes.filter(n => !n.isPinned),
  ].slice(0, 3);

  // Filtrar entradas dos hábitos recentes
  const recentHabitEntries = entries.filter(e => 
    recentHabits.some(h => h.id === e.habitId)
  );

  const loading = tasksLoading || projectsLoading || habitsLoading || notesLoading || financesLoading;

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
            <QuickTasks tasks={recentTasks} onToggleTask={handleToggleTask} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickProjects projects={recentProjects} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickHabits habits={recentHabits} entries={recentHabitEntries} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <QuickNotes notes={sortedNotes} />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <AdSpace size="banner" adId="dashboard-bottom" />
        </Box>
      </Box>
    </Box>
  );
}