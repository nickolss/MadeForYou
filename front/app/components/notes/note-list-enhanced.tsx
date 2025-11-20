import { Paper, Typography, Grid, Box } from "@mui/material";
import { NoteItem } from "./note-item";
import { Note } from "@/app/types";

interface NoteListEnhancedProps {
	notes: Note[];
	onEditNote: (note: Note) => void;
	onDeleteNote: (id: number) => void;
	onTogglePin: (id: number) => void;
	onNoteClick: (note: Note) => void;
	title?: string;
}

export function NoteListEnhanced({
	notes,
	onEditNote,
	onDeleteNote,
	onTogglePin,
	onNoteClick,
	title = "Minhas Notas",
}: NoteListEnhancedProps) {
	const pinnedNotes = notes.filter((n) => n.isPinned);
	const regularNotes = notes.filter((n) => !n.isPinned);

	if (notes.length === 0) {
		return (
			<Paper elevation={0} sx={{ p: 3 }}>
				<Typography variant="h6" gutterBottom>
					{title}
				</Typography>
				<Box
					sx={{
						py: 6,
						textAlign: "center",
					}}
				>
					<Typography variant="body2" color="text.secondary">
						Nenhuma nota encontrada. Comece criando sua primeira nota!
					</Typography>
				</Box>
			</Paper>
		);
	}

	return (
		<Paper elevation={0} sx={{ p: 3 }}>
			<Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
				{title} ({notes.length})
			</Typography>
			<Grid container spacing={2}>
				{pinnedNotes.map((note) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
						<NoteItem
							note={note}
							onEdit={onEditNote}
							onDelete={onDeleteNote}
							onTogglePin={onTogglePin}
							onClick={() => onNoteClick(note)}
						/>
					</Grid>
				))}
				{regularNotes.map((note) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
						<NoteItem
							note={note}
							onEdit={onEditNote}
							onDelete={onDeleteNote}
							onTogglePin={onTogglePin}
							onClick={() => onNoteClick(note)}
						/>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
}
