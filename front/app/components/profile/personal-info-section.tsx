"use client";

import * as React from "react";
import {
	Box,
	TextField,
	Typography,
	Grid,
	IconButton,
	CircularProgress,
	Alert,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { useAuth } from "@/app/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/app/services/user-profile";

export function PersonalInfoSection() {
	const { currentUser } = useAuth();
	const [isEditing, setIsEditing] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const [originalData, setOriginalData] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "", // TODO: Campo não existente no BD atual
		bio: "", // TODO: Campo não existente no BD atual
	});

	const [formData, setFormData] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		bio: "",
	});

	React.useEffect(() => {
		const loadData = async () => {
			if (!currentUser) return;

			try {
				setLoading(true);
				const profile = await getUserProfile(currentUser.uid);

				if (profile) {
					const data = {
						firstName: profile.first_name || "",
						lastName: profile.last_name || "",
						email: profile.email || currentUser.email || "",
						phone: "",
						bio: "",
					};
					setFormData(data);
					setOriginalData(data);
				}
			} catch (err) {
				console.error(err);
				setError("Erro ao carregar informações.");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [currentUser]);

	const handleSave = async () => {
		if (!currentUser) return;
		setSaving(true);
		setError(null);

		try {
			await updateUserProfile(currentUser.uid, {
				first_name: formData.firstName,
				last_name: formData.lastName,
				// phone e bio precisariam ser adicionados no Java/Postgres para serem salvos
			});

			setOriginalData(formData);
			setIsEditing(false);
		} catch (err) {
			console.error(err);
			setError("Erro ao salvar alterações.");
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		setFormData(originalData);
		setIsEditing(false);
		setError(null);
	};

	if (loading) {
		return (
			<Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: "bold" }}>
					Informações Pessoais
				</Typography>
				{!isEditing ? (
					<IconButton
						onClick={() => setIsEditing(true)}
						sx={{ color: "primary.main" }}
					>
						<Edit />
					</IconButton>
				) : (
					<Box>
						<IconButton
							onClick={handleCancel}
							sx={{ color: "text.secondary", mr: 1 }}
							disabled={saving}
						>
							<Cancel />
						</IconButton>
						<IconButton
							onClick={handleSave}
							sx={{ color: "primary.main" }}
							disabled={saving}
						>
							{saving ? <CircularProgress size={20} /> : <Save />}
						</IconButton>
					</Box>
				)}
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						label="Nome"
						value={formData.firstName}
						onChange={(e) =>
							setFormData({ ...formData, firstName: e.target.value })
						}
						fullWidth
						disabled={!isEditing || saving}
						variant={isEditing ? "outlined" : "filled"}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						label="Sobrenome"
						value={formData.lastName}
						onChange={(e) =>
							setFormData({ ...formData, lastName: e.target.value })
						}
						fullWidth
						disabled={!isEditing || saving}
						variant={isEditing ? "outlined" : "filled"}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						label="E-mail"
						type="email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						fullWidth
						disabled={true}
						variant="filled"
						helperText="O e-mail não pode ser alterado."
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						label="Telefone"
						value={formData.phone}
						onChange={(e) =>
							setFormData({ ...formData, phone: e.target.value })
						}
						fullWidth
						disabled={!isEditing || saving}
						variant={isEditing ? "outlined" : "filled"}
						placeholder="(00) 00000-0000"
						helperText="Não será salvo no banco (campo não existe)"
					/>
				</Grid>
				<Grid size={12}>
					<TextField
						label="Biografia"
						value={formData.bio}
						onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
						fullWidth
						multiline
						rows={3}
						disabled={!isEditing || saving}
						variant={isEditing ? "outlined" : "filled"}
						placeholder="Conte um pouco sobre você..."
						helperText="Não será salvo no banco (campo não existe)"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
