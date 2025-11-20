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
import { ProjectStats } from "@/app/components/projects/project-stats";
import { ProjectFilters } from "@/app/components/projects/project-filters";
import { ProjectListEnhanced } from "@/app/components/projects/project-list-enhanced";
import { AdSpace } from "@/app/components/ads/ad-space";
import { useProjects } from "@/app/hooks/useProjects";
import { Project } from "@/app/types/project";

type FilterType = "all" | "planning" | "in-progress" | "on-hold" | "completed";

export default function ProjectsPage() {
	const userName = "Usuário";
	const {
		projects,
		loading,
		error,
		createProject,
		updateProject,
		deleteProject,
	} = useProjects();
	const [filter, setFilter] = React.useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [openDialog, setOpenDialog] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [editingProject, setEditingProject] = React.useState<Project | null>(
		null
	);
	const [formData, setFormData] = React.useState({
		name: "",
		description: "",
		progress: 0,
		status: "planning" as Project["status"],
		priority: "medium" as Project["priority"],
		startDate: "",
		dueDate: "",
	});

	const handleStatusChange = async (id: number, status: Project["status"]) => {
		try {
			await updateProject(id, { status });
		} catch (err) {
			console.error("Erro ao atualizar status do projeto:", err);
			alert("Erro ao atualizar status. Tente novamente.");
		}
	};

	const handleDeleteProject = async (projectId: number) => {
		if (confirm("Tem certeza que deseja excluir este projeto?")) {
			try {
				await deleteProject(projectId);
			} catch (err) {
				console.error("Erro ao deletar projeto:", err);
				alert("Erro ao deletar projeto. Tente novamente.");
			}
		}
	};

	const handleEditProject = (project: Project) => {
		setEditingProject(project);
		setFormData({
			name: project.name,
			description: project.description || "",
			progress: project.progress,
			status: project.status || "planning",
			priority: project.priority || "medium",
			startDate: project.startDate || "",
			dueDate: project.dueDate || "",
		});
		setOpenDialog(true);
	};

	const handleAddProject = () => {
		setEditingProject(null);
		setFormData({
			name: "",
			description: "",
			progress: 0,
			status: "planning",
			priority: "medium",
			startDate: "",
			dueDate: "",
		});
		setOpenDialog(true);
	};

	const handleSaveProject = async () => {
		if (!formData.name.trim()) return;

		setSaving(true);
		try {
			if (editingProject) {
				await updateProject(editingProject.id, {
					name: formData.name,
					description: formData.description || undefined,
					progress: formData.progress,
					status: formData.status,
					priority: formData.priority,
					startDate: formData.startDate || undefined,
					dueDate: formData.dueDate || undefined,
				});
			} else {
				await createProject({
					name: formData.name,
					description: formData.description || undefined,
					progress: formData.progress,
					status: formData.status,
					priority: formData.priority,
					startDate: formData.startDate || undefined,
					dueDate: formData.dueDate || undefined,
				});
			}
			setOpenDialog(false);
		} catch (err) {
			console.error("Erro ao salvar projeto:", err);
			alert("Erro ao salvar projeto. Tente novamente.");
		} finally {
			setSaving(false);
		}
	};

	const filteredProjects = projects.filter((project) => {
		const matchesFilter = filter === "all" || project.status === filter;

		const matchesSearch =
			searchQuery === "" ||
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description?.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	const stats = {
		total: projects.length,
		completed: projects.filter((p) => p.status === "completed").length,
		inProgress: projects.filter((p) => p.status === "in-progress").length,
		onHold: projects.filter((p) => p.status === "on-hold").length,
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
						Meus Projetos
					</Typography>
					<Button
						variant="contained"
						startIcon={<Add />}
						onClick={handleAddProject}
						sx={{ textTransform: "none" }}
					>
						Novo Projeto
					</Button>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error.message}
					</Alert>
				)}

				<ProjectStats {...stats} />

				<ProjectFilters
					filter={filter}
					onFilterChange={setFilter}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				<Box sx={{ my: 3 }}>
					<AdSpace size="inline" adId="projects-top" />
				</Box>

				<Grid container spacing={3}>
					<Grid size={12}>
						<ProjectListEnhanced
							projects={filteredProjects}
							onEditProject={handleEditProject}
							onDeleteProject={handleDeleteProject}
							onStatusChange={handleStatusChange}
						/>
					</Grid>
				</Grid>

				<Box sx={{ my: 3 }}>
					<AdSpace size="banner" adId="projects-bottom" />
				</Box>

				<Dialog
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>
						{editingProject ? "Editar Projeto" : "Novo Projeto"}
					</DialogTitle>
					<DialogContent>
						<Box
							sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
						>
							<TextField
								label="Nome do projeto"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								fullWidth
								required
							/>
							<TextField
								label="Descrição"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								fullWidth
								multiline
								rows={3}
							/>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										label="Progresso (%)"
										type="number"
										value={formData.progress}
										onChange={(e) =>
											setFormData({
												...formData,
												progress: parseInt(e.target.value) || 0,
											})
										}
										fullWidth
										inputProps={{ min: 0, max: 100 }}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										select
										label="Status"
										value={formData.status}
										onChange={(e) =>
											setFormData({
												...formData,
												status: e.target.value as Project["status"],
											})
										}
										fullWidth
									>
										<MenuItem value="planning">Planejamento</MenuItem>
										<MenuItem value="in-progress">Em Progresso</MenuItem>
										<MenuItem value="on-hold">Em Pausa</MenuItem>
										<MenuItem value="completed">Concluído</MenuItem>
									</TextField>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										select
										label="Prioridade"
										value={formData.priority}
										onChange={(e) =>
											setFormData({
												...formData,
												priority: e.target.value as Project["priority"],
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
										label="Data de início"
										type="date"
										value={formData.startDate}
										onChange={(e) =>
											setFormData({ ...formData, startDate: e.target.value })
										}
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
									/>
								</Grid>
								<Grid size={12}>
									<TextField
										label="Data de conclusão"
										type="date"
										value={formData.dueDate}
										onChange={(e) =>
											setFormData({ ...formData, dueDate: e.target.value })
										}
										fullWidth
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
							onClick={handleSaveProject}
							variant="contained"
							disabled={!formData.name.trim() || saving}
							sx={{ textTransform: "none" }}
						>
							{saving ? (
								<CircularProgress size={20} />
							) : editingProject ? (
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
