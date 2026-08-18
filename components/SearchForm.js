'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useBooking } from '@/context/BookingContext';

// All fields + the button share this height so they line up in the row layout.
const FIELD_HEIGHT = 56;

export default function SearchForm() {
  const router = useRouter();
  const { search, setSearch } = useBooking();

  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState(search.from || null);
  const [to, setTo] = useState(search.to || null);
  const [date, setDate] = useState(search.date ? dayjs(search.date) : dayjs().add(1, 'day'));

  // Ask the backend for the list of cities (our first "talk to the server" moment).
  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then(setCities)
      .catch(() => setCities([]));
  }, []);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const sameCity = from && to && from === to;
  const valid = from && to && !sameCity && date;

  const submit = () => {
    if (!valid) return;
    setSearch({ from, to, date: date.format('YYYY-MM-DD') });
    router.push('/results');
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 1.5,
        }}
      >
        <Autocomplete
          options={cities}
          value={from}
          onChange={(_, v) => setFrom(v)}
          sx={{ flex: 1 }}
          renderInput={(params) => <TextField {...params} label="From" placeholder="Leaving from" />}
        />

        <IconButton
          onClick={swap}
          aria-label="swap cities"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            alignSelf: 'center',
            transform: { xs: 'rotate(90deg)', md: 'none' },
          }}
        >
          <SwapHorizRoundedIcon />
        </IconButton>

        <Autocomplete
          options={cities}
          value={to}
          onChange={(_, v) => setTo(v)}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField {...params} label="To" placeholder="Going to" error={Boolean(sameCity)} />
          )}
        />

        <DatePicker
          label="Date of journey"
          value={date}
          minDate={dayjs()}
          onChange={(v) => setDate(v)}
          sx={{ flex: 1 }}
        />

        <Button
          onClick={submit}
          disabled={!valid}
          variant="contained"
          startIcon={<SearchRoundedIcon />}
          sx={{ height: FIELD_HEIGHT, px: 4, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Search buses
        </Button>
      </Box>

      {sameCity && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          Please pick two different cities.
        </Typography>
      )}
    </Box>
  );
}
