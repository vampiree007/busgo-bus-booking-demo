'use client';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SearchForm from '@/components/SearchForm';
import { useBooking } from '@/context/BookingContext';

const POPULAR = [
  ['Bengaluru', 'Goa'],
  ['Mumbai', 'Pune'],
  ['Chennai', 'Tirupati'],
  ['Hyderabad', 'Vijayawada'],
  ['Bengaluru', 'Hampi'],
];

const FEATURES = [
  { icon: <BoltRoundedIcon />, title: 'Instant booking', text: 'Pick seats and pay in a few taps.' },
  { icon: <VerifiedUserRoundedIcon />, title: 'Secure & simple', text: 'A clean flow with no clutter.' },
  { icon: <EventSeatRoundedIcon />, title: 'Live seat maps', text: 'See exactly which berths are free.' },
];

export default function HomePage() {
  const router = useRouter();
  const { setSearch } = useBooking();

  const goPopular = (from, to) => {
    const date = dayjs().add(1, 'day').format('YYYY-MM-DD');
    setSearch({ from, to, date });
    router.push('/results');
  };

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg,#4429D6 0%,#5B3DF5 45%,#7C66FF 100%)',
          color: '#fff',
          pt: { xs: 6, md: 9 },
          pb: { xs: 12, md: 16 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 52 }, maxWidth: 720 }}>
            Book bus tickets in seconds.
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 16, md: 20 }, opacity: 0.9, maxWidth: 560 }}>
            Search hundreds of routes, choose your seat, and travel comfortably across the country.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -10 }, position: 'relative', zIndex: 1, pb: 8 }}>
        {/* Search card overlapping the hero */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 24px 60px rgba(20,20,40,0.14)',
          }}
        >
          <SearchForm />
        </Paper>

        {/* Popular routes */}
        <Box sx={{ mt: 4 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <TrendingUpRoundedIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1">Popular routes</Typography>
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {POPULAR.map(([from, to]) => (
              <Chip
                key={`${from}-${to}`}
                label={`${from} → ${to}`}
                onClick={() => goPopular(from, to)}
                sx={{
                  cursor: 'pointer',
                  py: 2,
                  px: 0.5,
                  fontSize: 14,
                  bgcolor: 'rgba(91,61,245,0.09)',
                  color: 'primary.dark',
                  '&:hover': { bgcolor: 'rgba(91,61,245,0.18)' },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Features */}
        <Box
          sx={{
            mt: 5,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          }}
        >
          {FEATURES.map((f) => (
            <Paper key={f.title} variant="outlined" sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  mb: 1.5,
                }}
              >
                {f.icon}
              </Box>
              <Typography variant="h6">{f.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {f.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  );
}
