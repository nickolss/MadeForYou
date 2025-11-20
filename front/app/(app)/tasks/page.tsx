"use client";

import * as React from "react";
import {
	Box,
	Toolbar,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Grid,
	CircularProgress,
	Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { TopNav } from "@/app/components/layout/topnav";
import { SideNav } from "@/app/components/layout/sidenav";
import { TaskStats } from "@/app/components/tasks/task-stats";
import { TaskFilters } from "@/app/components/tasks/task-filters";
import { TaskListEnhanced } from "@/app/components/tasks/task-list-enhanced";
import { AdSpace } from "@/app/components/ads/ad-space";
import { useTasks } from "@/app/hooks/useTasks";
import { Task } from "@/app/types/task";

type FilterType = "all" | "pending" | "completed";

export default function TasksPage() {
	const userName = "Usuário";
	const { tasks, loading, error, createTask, updateTask, deleteTask } =
		useTasks();
	const [filter, setFilter] = React.useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [openDialog, setOpenDialog] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [editingTask, setEditingTask] = React.useState<Task | null>(null);
	const [formData, setFormData] = React.useState({
		text: "",
		priority: "medium" as Task["priority"],
		category: "",
		dueDate: "",
	});

	const handleToggleTask = async (taskId: number) => {
		const task = tasks.find((t) => t.id === taskId);
		if (task) {
			try {
				await updateTask(taskId, { completed: !task.completed });
			} catch (err) {
				console.error("Erro ao atualizar tarefa:", err);
				alert("Erro ao atualizar tarefa. Tente novamente.");
			}
		}
	};

	const handleDeleteTask = async (taskId: number) => {
		if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
			try {
				await deleteTask(taskId);
			} catch (err) {
				console.error("Erro ao deletar tarefa:", err);
				alert("Erro ao deletar tarefa. Tente novamente.");
			}
		}
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setFormData({
			text: task.text,
			priority: task.priority || "medium",
			category: task.category || "",
			dueDate: task.dueDate || "",
		});
		setOpenDialog(true);
	};

	const handleAddTask = () => {
		setEditingTask(null);
		setFormData({
			text: "",
			priority: "medium",
			category: "",
			dueDate: "",
		});
		setOpenDialog(true);
	};

	const handleSaveTask = async () => {
		if (!formData.text.trim()) return;

		setSaving(true);
		try {
			if (editingTask) {
				await updateTask(editingTask.id, {
					text: formData.text,
					priority: formData.priority,
					category: formData.category || undefined,
					dueDate: formData.dueDate || undefined,
				});
			} else {
				await createTask({
					text: formData.text,
					completed: false,
					priority: formData.priority,
					category: formData.category || undefined,
					dueDate: formData.dueDate || undefined,
				});
			}
			setOpenDialog(false);
		} catch (err) {
			console.error("Erro ao salvar tarefa:", err);
			alert("Erro ao salvar tarefa. Tente novamente.");
		} finally {
			setSaving(false);
		}
	};

	const filteredTasks = tasks.filter((task) => {
		const matchesFilter =
			filter === "all" ||
			(filter === "completed" && task.completed) ||
			(filter === "pending" && !task.completed);

		const matchesSearch =
			searchQuery === "" ||
			task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.category?.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	const stats = {
		total: tasks.length,
		completed: tasks.filter((t) => t.completed).length,
		pending: tasks.filter((t) => !t.completed).length,
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex" }}>
			<TopNav userName={userName} />
			<SideNav />

			<Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
				<Toolbar />

				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 3,
					}}
				>
					<Typography variant="h4" sx={{ fontWeight: "bold" }}>
						Minhas Tarefas
					</Typography>
					<Button
						variant="contained"
						startIcon={<Add />}
						onClick={handleAddTask}
						sx={{ textTransform: "none" }}
					>
						Nova Tarefa
					</Button>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error.message}
					</Alert>
				)}

				<TaskStats {...stats} />

				<TaskFilters
					filter={filter}
					onFilterChange={setFilter}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				<Box sx={{ my: 3 }}>
					<AdSpace size="inline" adId="tasks-top" />
				</Box>

				<Grid container spacing={3}>
					<Grid size={12}>
						<TaskListEnhanced
							tasks={filteredTasks}
							onToggleTask={handleToggleTask}
							onDeleteTask={handleDeleteTask}
							onEditTask={handleEditTask}
						/>
					</Grid>
				</Grid>

				<Box sx={{ my: 3 }}>
					<AdSpace size="banner" adId="tasks-bottom" />
				</Box>

				<Dialog
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>
						{editingTask ? "Editar Tarefa" : "Nova Tarefa"}
					</DialogTitle>
					<DialogContent>
						<Box
							sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
						>
							<TextField
								label="Descrição da tarefa"
								value={formData.text}
								onChange={(e) =>
									setFormData({ ...formData, text: e.target.value })
								}
								fullWidth
								required
								multiline
								rows={3}
							/>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										select
										label="Prioridade"
										value={formData.priority}
										onChange={(e) =>
											setFormData({
												...formData,
												priority: e.target.value as Task["priority"],
											})
										}
										fullWidth
									>
										<MenuItem value="low">Baixa</MenuItem>
										<MenuItem value="medium">Média</MenuItem>
										<MenuItem value="high">Alta</MenuItem>
									</TextField>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										label="Data de vencimento"
										type="date"
										value={formData.dueDate}
										onChange={(e) =>
											setFormData({ ...formData, dueDate: e.target.value })
										}
										fullWidth
									/>
								</Grid>
								<Grid size={12}>
									<TextField
										label="Categoria"
										value={formData.category}
										onChange={(e) =>
											setFormData({ ...formData, category: e.target.value })
										}
										fullWidth
										placeholder="Ex: Trabalho, Pessoal, Saúde..."
									/>
								</Grid>
							</Grid>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => setOpenDialog(false)}
							sx={{ textTransform: "none" }}
						>
							Cancelar
						</Button>
						<Button
							onClick={handleSaveTask}
							variant="contained"
							disabled={!formData.text.trim() || saving}
							sx={{ textTransform: "none" }}
						>
							{saving ? (
								<CircularProgress size={20} />
							) : editingTask ? (
								"Salvar"
							) : (
								"Criar"
							)}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	);
}
