'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DriveEtaRoundedIcon from '@mui/icons-material/DriveEtaRounded';

function Seat({ id, kind, state, onClick }) {
  const size = kind === 'sleeper' ? { width: 34, height: 62 } : { width: 42, height: 42 };
  const variants = {
    available: {
      border: '1.5px solid #CBD5E1',
      color: 'text.secondary',
      bgcolor: '#fff',
      cursor: 'pointer',
      '&:hover': { borderColor: 'primary.main', color: 'primary.main', transform: 'scale(1.08)' },
    },
    selected: {
      bgcolor: 'primary.main',
      color: '#fff',
      border: '1.5px solid',
      borderColor: 'primary.main',
      cursor: 'pointer',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 14px rgba(91,61,245,0.40)',
    },
    booked: {
      bgcolor: '#E5E7EB',
      color: '#9CA3AF',
      border: '1.5px solid #E5E7EB',
      cursor: 'not-allowed',
    },
  };
  return (
    <Box
      component="button"
      type="button"
      disabled={state === 'booked'}
      aria-label={`Seat ${id}${state === 'booked' ? ' booked' : state === 'selected' ? ' selected' : ''}`}
      aria-pressed={state === 'selected'}
      onClick={state === 'booked' ? undefined : onClick}
      sx={{
        ...size,
        display: 'grid',
        placeItems: 'center',
        borderRadius: kind === 'sleeper' ? '8px' : '10px',
        fontFamily: 'inherit',
        fontSize: 11,
        fontWeight: 700,
        p: 0,
        appearance: 'none',
        userSelect: 'none',
        transition: 'transform .15s ease, background-color .15s ease, border-color .15s ease',
        ...variants[state],
      }}
    >
      {id}
    </Box>
  );
}

function Swatch({ color, border, label }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: color, border }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}

export default function SeatMap({ seatLayout, bookedSeats, selectedSeats, onToggle }) {
  const [deck, setDeck] = useState(0);
  const booked = new Set(bookedSeats);
  const selected = new Set(selectedSeats);
  const isSleeper = seatLayout.kind === 'sleeper';
  const active = seatLayout.decks[deck];

  const stateOf = (id) => (booked.has(id) ? 'booked' : selected.has(id) ? 'selected' : 'available');

  return (
    <Box>
      {/* Legend */}
      <Stack direction="row" spacing={2} useFlexGap sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Swatch color="#fff" border="1.5px solid #CBD5E1" label="Available" />
        <Swatch color="#5B3DF5" border="none" label="Selected" />
        <Swatch color="#E5E7EB" border="none" label="Booked" />
      </Stack>

      {isSleeper && (
        <Tabs value={deck} onChange={(_, v) => setDeck(v)} sx={{ mb: 1 }}>
          {seatLayout.decks.map((d) => (
            <Tab key={d.name} label={`${d.name} deck`} />
          ))}
        </Tabs>
      )}

      {/* Bus body */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', maxWidth: 360 }}>
        <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 1.5, color: 'text.disabled' }}>
          <DriveEtaRoundedIcon fontSize="small" />
        </Stack>
        <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', pt: 2 }}>
          {active.rows.map((row, ri) => (
            <Stack key={ri} direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
              {row.map((cell, ci) =>
                cell === null ? (
                  <Box key={`gap-${ci}`} sx={{ width: isSleeper ? 18 : 22 }} />
                ) : (
                  <Seat
                    key={cell}
                    id={cell}
                    kind={seatLayout.kind}
                    state={stateOf(cell)}
                    onClick={() => onToggle(cell)}
                  />
                ),
              )}
            </Stack>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
