'use client';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import { formatINR, formatTime, formatDateLabel } from '@/utils/format';

export default function TicketCard({ booking }) {
  const passengers = booking.passengers || {};

  return (
    <Paper
      variant="outlined"
      sx={{ overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}
    >
      {/* Main */}
      <Box sx={{ flex: 1, p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">{booking.operator}</Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.type}
            </Typography>
          </Box>
          <Chip label={booking.status} color="success" size="small" />
        </Stack>

        {/* Route */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">{formatTime(booking.depTime)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {booking.from}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', color: 'text.disabled' }}>
            <DirectionsBusRoundedIcon />
            <Box sx={{ height: 2, bgcolor: 'divider', borderRadius: 1 }} />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6">
              {formatTime(booking.arrivalTime)}
              {booking.arrivalDayOffset > 0 && (
                <Typography component="span" variant="caption" color="secondary.main" sx={{ ml: 0.5 }}>
                  +{booking.arrivalDayOffset}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {booking.to}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2 }}>
          <Chip size="small" variant="outlined" label={formatDateLabel(booking.date)} />
          {booking.contact?.boarding && (
            <Chip size="small" variant="outlined" label={`Board: ${booking.contact.boarding}`} />
          )}
          {booking.contact?.dropping && (
            <Chip size="small" variant="outlined" label={`Drop: ${booking.contact.dropping}`} />
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Passengers
        </Typography>
        <Stack spacing={0.25}>
          {booking.seats.map((s) => (
            <Typography key={s} variant="body2" color="text.secondary">
              <b>Seat {s}</b> · {passengers[s]?.name || '—'}
              {passengers[s]?.age ? `, ${passengers[s].age}` : ''}
            </Typography>
          ))}
        </Stack>
      </Box>

      {/* Perforated stub */}
      <Box
        sx={{
          borderTop: { xs: '2px dashed', sm: 'none' },
          borderLeft: { sm: '2px dashed' },
          borderColor: { xs: 'divider', sm: 'divider' },
          bgcolor: '#F1EFFF',
          p: { xs: 2.5, md: 3 },
          minWidth: { sm: 200 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          PNR
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontFamily: 'monospace', letterSpacing: 2, fontWeight: 700, mb: 1 }}
        >
          {booking.pnr}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Amount paid
        </Typography>
        <Typography variant="h6" color="primary.main">
          {formatINR(booking.amount)}
        </Typography>
      </Box>
    </Paper>
  );
}
