import { Box, TextField, InputAdornment, Chip, Autocomplete } from '@mui/material';
import { Search } from '@mui/icons-material';

interface NoteFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    categories: string[];
}

export function NoteFilters({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
}: NoteFiltersProps) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
                placeholder="Buscar notas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                sx={{ flexGrow: 1, minWidth: 250 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

            <Autocomplete
                options={categories}
                value={selectedCategory}
                onChange={(_, value) => onCategoryChange(value)}
                size="small"
                sx={{ minWidth: 200 }}
                renderInput={(params) => (
                    <TextField {...params} placeholder="Todas as categorias" />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <Chip label={option} size="small" sx={{ mr: 1 }} />
                        {option}
                    </Box>
                )}
            />
        </Box>
    );
}

