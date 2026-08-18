'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import TicketCard from '@/components/TicketCard';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const firedConfetti = useRef(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => active && setBooking(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [bookingId]);

  // Celebrate once, when the ticket first appears.
  useEffect(() => {
    if (booking && !firedConfetti.current) {
      firedConfetti.current = true;
      // Loaded lazily so it only ever runs in the browser.
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 130, spread: 75, origin: { y: 0.35 } });
        setTimeout(() => confetti({ particleCount: 80, spread: 110, origin: { y: 0.4 } }), 280);
      });
    }
  }, [booking]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: '8px' }} />
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Booking not found</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => router.push('/')}>
          Back to search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleRoundedIcon sx={{ fontSize: 72, color: 'success.main' }} />
        <Typography variant="h4" sx={{ mt: 1 }}>
          Booking confirmed!
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Your ticket for {booking.from} → {booking.to} is ready. A copy has been saved to{' '}
          <b>My Bookings</b>.
        </Typography>
      </Box>

      <TicketCard booking={booking} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'center', mt: 4 }}
        className="no-print"
      >
        <Button variant="contained" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>
          Print ticket
        </Button>
        <Button
          variant="outlined"
          startIcon={<ConfirmationNumberRoundedIcon />}
          onClick={() => router.push('/bookings')}
        >
          View all bookings
        </Button>
        <Button startIcon={<HomeRoundedIcon />} onClick={() => router.push('/')}>
          Book another
        </Button>
      </Stack>
    </Container>
  );
}
