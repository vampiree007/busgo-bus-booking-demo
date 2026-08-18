'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import TicketCard from '@/components/TicketCard';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => active && setBookings(data))
      .catch(() => active && setBookings([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Bookings
      </Typography>

      {/* Loading */}
      {bookings === null && (
        <Stack spacing={2}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={220} sx={{ borderRadius: '8px' }} />
          ))}
        </Stack>
      )}

      {/* Empty */}
      {bookings !== null && bookings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ConfirmationNumberRoundedIcon sx={{ fontSize: 56, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No bookings yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Book a bus and your tickets will show up here.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/')}>
            Search buses
          </Button>
        </Box>
      )}

      {/* List */}
      {bookings !== null && bookings.length > 0 && (
        <Stack spacing={3}>
          {bookings.map((b) => (
            <Box key={b.id}>
              <TicketCard booking={b} />
              <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<OpenInNewRoundedIcon />}
                  onClick={() => router.push(`/confirmation/${b.id}`)}
                >
                  View & print ticket
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
