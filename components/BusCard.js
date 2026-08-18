'use client';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { formatTime, formatDuration, formatINR } from '@/utils/format';

export default function BusCard({ bus, onSelect }) {
  const lowSeats = bus.seatsAvailable <= 5;

  return (
    <Card sx={{ p: { xs: 2, md: 2.5 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { md: 'center' },
        }}
      >
        {/* Operator + type */}
        <Box sx={{ flex: 1.2, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography variant="h6" noWrap>
              {bus.operator}
            </Typography>
            <Chip
              size="small"
              icon={<StarRoundedIcon sx={{ fontSize: 16, color: '#fff !important' }} />}
              label={bus.rating.toFixed(1)}
              sx={{ bgcolor: 'success.main', color: '#fff' }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {bus.type}
          </Typography>
          <Stack direction="row" spacing={0.5} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
            {bus.amenities.slice(0, 3).map((a) => (
              <Chip key={a} label={a} size="small" variant="outlined" />
            ))}
            {bus.amenities.length > 3 && (
              <Chip label={`+${bus.amenities.length - 3}`} size="small" variant="outlined" />
            )}
          </Stack>
        </Box>

        {/* Timing */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: 1.3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">{formatTime(bus.depTime)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {bus.from}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(bus.durationMin)}
            </Typography>
            <Box sx={{ height: 2, bgcolor: 'divider', borderRadius: 1, my: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              non-stop
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">
              {formatTime(bus.arrivalTime)}
              {bus.arrivalDayOffset > 0 && (
                <Typography component="span" variant="caption" color="secondary.main" sx={{ ml: 0.5 }}>
                  +{bus.arrivalDayOffset}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {bus.to}
            </Typography>
          </Box>
        </Stack>

        {/* Price + CTA */}
        <Box sx={{ flex: 0.9, textAlign: { xs: 'left', md: 'right' } }}>
          <Typography variant="h5" color="primary.main">
            {formatINR(bus.price)}
          </Typography>
          <Typography variant="caption" sx={{ color: lowSeats ? 'secondary.main' : 'text.secondary' }}>
            {bus.seatsAvailable} seats left
          </Typography>
          <Button
            variant="contained"
            onClick={() => onSelect(bus)}
            disabled={bus.seatsAvailable === 0}
            sx={{ mt: 1, display: 'block', ml: { md: 'auto' } }}
          >
            {bus.seatsAvailable === 0 ? 'Sold out' : 'Select seats'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
