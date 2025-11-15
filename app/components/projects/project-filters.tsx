import { Box, ToggleButtonGroup, ToggleButton, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

type FilterType = 'all' | 'planning' | 'in-progress' | 'on-hold' | 'completed';

interface ProjectFiltersProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function ProjectFilters({
    filter,
    onFilterChange,
    searchQuery,
    onSearchChange,
}: ProjectFiltersProps) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, value) => value && onFilterChange(value)}
                aria-label="Filtro de projetos"
                sx={{
                    '& .MuiToggleButton-root': {
                        textTransform: 'none',
                        px: 2,
                    },
                }}
            >
                <ToggleButton value="all">Todos</ToggleButton>
                <ToggleButton value="planning">Planejamento</ToggleButton>
                <ToggleButton value="in-progress">Em Progresso</ToggleButton>
                <ToggleButton value="on-hold">Em Pausa</ToggleButton>
                <ToggleButton value="completed">Concluídos</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                placeholder="Buscar projetos..."
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
        </Box>
    );
}

