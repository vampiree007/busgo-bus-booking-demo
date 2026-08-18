'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import BusCard from '@/components/BusCard';
import Filters from '@/components/Filters';
import { useBooking } from '@/context/BookingContext';
import { formatDateLabel } from '@/utils/format';

const matchesType = (type, tag) => {
  const t = type.toLowerCase();
  const nonAc = t.includes('non-ac');
  if (tag === 'AC') return t.includes('ac') && !nonAc;
  if (tag === 'Non-AC') return nonAc;
  if (tag === 'Sleeper') return t.includes('sleeper');
  if (tag === 'Seater') return t.includes('seater');
  return true;
};

const matchesWindow = (depTime, w) => {
  const h = parseInt(depTime.split(':')[0], 10);
  if (w === 'Before 12 PM') return h < 12;
  if (w === '12 – 6 PM') return h >= 12 && h < 18;
  if (w === 'After 6 PM') return h >= 18;
  return true;
};

export default function ResultsPage() {
  const router = useRouter();
  const { search, startBooking } = useBooking();
  const ready = Boolean(search.from && search.to);

  const [buses, setBuses] = useState(null);
  const [loading, setLoading] = useState(ready);
  const [sort, setSort] = useState('departure');
  const [types, setTypes] = useState([]);
  const [windows, setWindows] = useState([]);
  const [bounds, setBounds] = useState([0, 2000]);
  const [price, setPrice] = useState([0, 2000]);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setLoading(true);
    const q = new URLSearchParams({ from: search.from, to: search.to, date: search.date || '' });
    fetch(`/api/buses?${q}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setBuses(data);
        if (data.length) {
          const ps = data.map((b) => b.price);
          const lo = Math.min(...ps);
          const hi = Math.max(...ps);
          setBounds([lo, hi]);
          setPrice([lo, hi]);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [ready, search.from, search.to, search.date]);

  const toggle = (setter) => (val) =>
    setter((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const visible = useMemo(() => {
    if (!buses) return [];
    const list = buses.filter((b) => {
      if (types.length && !types.some((t) => matchesType(b.type, t))) return false;
      if (windows.length && !windows.some((w) => matchesWindow(b.depTime, w))) return false;
      if (b.price < price[0] || b.price > price[1]) return false;
      return true;
    });
    const sorters = {
      departure: (a, b) => a.depTime.localeCompare(b.depTime),
      priceLow: (a, b) => a.price - b.price,
      duration: (a, b) => a.durationMin - b.durationMin,
      rating: (a, b) => b.rating - a.rating,
    };
    return list.sort(sorters[sort]);
  }, [buses, types, windows, price, sort]);

  const select = (bus) => {
    startBooking(bus);
    router.push(`/book/${bus.id}`);
  };

  // No search in memory (e.g. opened directly / after a reload) — nudge back to search.
  if (!ready) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <SearchOffRoundedIcon sx={{ fontSize: 56, color: 'text.secondary' }} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Start a search
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Tell us where and when you want to travel.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')}>
          Search buses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Route header */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant="h6">{search.from}</Typography>
          <ArrowForwardRoundedIcon color="primary" />
          <Typography variant="h6">{search.to}</Typography>
        </Stack>
        {search.date && <Chip label={formatDateLabel(search.date)} variant="outlined" />}
        <Typography color="text.secondary" sx={{ ml: { sm: 'auto' } }}>
          {loading ? 'Searching…' : `${visible.length} buses available`}
        </Typography>
        <Button startIcon={<EditRoundedIcon />} onClick={() => router.push('/')} size="small">
          Modify
        </Button>
      </Paper>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '280px 1fr' } }}>
        <Filters
          sort={sort}
          setSort={setSort}
          types={types}
          toggleType={toggle(setTypes)}
          windows={windows}
          toggleWindow={toggle(setWindows)}
          price={price}
          setPrice={setPrice}
          bounds={bounds}
        />

        <Stack spacing={2}>
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: '8px' }} />
            ))}

          {!loading && visible.length === 0 && (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6">No buses match your filters</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Try widening the price range or clearing some filters.
              </Typography>
            </Paper>
          )}

          {!loading && visible.map((bus) => <BusCard key={bus.id} bus={bus} onSelect={select} />)}
        </Stack>
      </Box>
    </Container>
  );
}
