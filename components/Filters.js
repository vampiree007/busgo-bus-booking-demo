'use client';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { formatINR } from '@/utils/format';

const TYPE_TAGS = ['AC', 'Non-AC', 'Sleeper', 'Seater'];
const WINDOWS = ['Before 12 PM', '12 – 6 PM', 'After 6 PM'];

function ChipGroup({ options, selected, onToggle }) {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <Chip
            key={o}
            label={o}
            onClick={() => onToggle(o)}
            color={on ? 'primary' : 'default'}
            variant={on ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
        );
      })}
    </Stack>
  );
}

export default function Filters({
  sort,
  setSort,
  types,
  toggleType,
  windows,
  toggleWindow,
  price,
  setPrice,
  bounds,
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 80 } }}>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="departure">Departure (earliest)</MenuItem>
          <MenuItem value="priceLow">Price (low to high)</MenuItem>
          <MenuItem value="duration">Duration (shortest)</MenuItem>
          <MenuItem value="rating">Rating (highest)</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Bus type
      </Typography>
      <ChipGroup options={TYPE_TAGS} selected={types} onToggle={toggleType} />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Departure time
      </Typography>
      <ChipGroup options={WINDOWS} selected={windows} onToggle={toggleWindow} />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Price range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={price}
          min={bounds[0]}
          max={bounds[1]}
          step={50}
          onChange={(_, v) => setPrice(v)}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => formatINR(v)}
        />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {formatINR(price[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatINR(price[1])}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
