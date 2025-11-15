import { Box, ToggleButtonGroup, ToggleButton, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

type FilterType = 'all' | 'pending' | 'completed';

interface TaskFiltersProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function TaskFilters({
    filter,
    onFilterChange,
    searchQuery,
    onSearchChange,
}: TaskFiltersProps) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, value) => value && onFilterChange(value)}
                aria-label="Filtro de tarefas"
                sx={{
                    '& .MuiToggleButton-root': {
                        textTransform: 'none',
                        px: 3,
                    },
                }}
            >
                <ToggleButton value="all">Todas</ToggleButton>
                <ToggleButton value="pending">Pendentes</ToggleButton>
                <ToggleButton value="completed">Concluídas</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                placeholder="Buscar tarefas..."
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

