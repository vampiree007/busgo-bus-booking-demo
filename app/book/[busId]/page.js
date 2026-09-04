'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SeatMap from '@/components/SeatMap';
import PassengerForm from '@/components/PassengerForm';
import PaymentMock from '@/components/PaymentMock';
import { useBooking } from '@/context/BookingContext';
import { formatINR, formatTime, formatDateLabel } from '@/utils/format';

const STEPS = ['Select seats', 'Passenger details', 'Payment'];
const MAX_SEATS = 6;

export default function BookingPage() {
  const { busId } = useParams();
  const router = useRouter();
  const { search, seats, toggleSeat, passengers, setPassenger, contact, setContact, clearBooking } =
    useBooking();
  const date = search.date || new Date().toISOString().slice(0, 10);

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/buses/${busId}?date=${date}`)
      .then(async (r) => {
        if (!r.ok) {
          if (active) setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (active && data) setBus(data);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [busId, date]);

  const seatsValid = seats.length > 0;
  const paxValid = seats.every((s) => {
    const p = passengers[s];
    return p && p.name.trim() && String(p.age).trim() && p.gender;
  });
  const contactValid = Boolean(
    contact.phone?.trim() && contact.email?.trim() && contact.boarding && contact.dropping,
  );
  const total = bus ? bus.price * seats.length : 0;
  const canNext = step === 0 ? seatsValid : step === 1 ? paxValid && contactValid : false;

  const back = () => (step === 0 ? router.push('/results') : setStep((s) => s - 1));

  const onPay = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busId, date, seats, passengers, contact }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || 'Booking failed');
    }
    const booking = await res.json();
    clearBooking();
    router.push(`/confirmation/${booking.id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rounded" height={60} sx={{ mb: 3, borderRadius: '8px' }} />
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: '8px' }} />
      </Container>
    );
  }

  if (notFound || !bus) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Bus not found</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          That bus may no longer be available.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')}>
          Back to search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={back} sx={{ mb: 2 }}>
        {step === 0 ? 'Back to results' : 'Back'}
      </Button>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 340px' } }}>
        {/* Step content */}
        <Box sx={{ minWidth: 0 }}>
          {step === 0 && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
              >
                <Typography variant="h6">Choose your seats</Typography>
                <Typography variant="body2" color="text.secondary">
                  {seats.length}/{MAX_SEATS} selected
                </Typography>
              </Stack>
              <SeatMap
                seatLayout={bus.seatLayout}
                bookedSeats={bus.bookedSeats}
                selectedSeats={seats}
                onToggle={(seat) => toggleSeat(seat, MAX_SEATS)}
              />
            </Paper>
          )}

          {step === 1 && (
            <PassengerForm
              seats={seats}
              passengers={passengers}
              setPassenger={setPassenger}
              contact={contact}
              setContact={setContact}
              from={bus.from}
              to={bus.to}
            />
          )}

          {step === 2 && <PaymentMock amount={total} onPay={onPay} />}

          {step < 2 && (
            <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
              >
                {step === 0 ? 'Continue to passengers' : 'Continue to payment'}
              </Button>
            </Stack>
          )}
        </Box>

        {/* Fare summary (sticky on desktop) */}
        <Box sx={{ minWidth: 0 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 80 }, bgcolor: '#F5F4FF', borderColor: '#E2DEFB' }}
          >
            <Typography variant="h6">{bus.operator}</Typography>
            <Typography variant="body2" color="text.secondary">
              {bus.type}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Row label="Route" value={`${bus.from} → ${bus.to}`} />
              <Row label="Date" value={formatDateLabel(date)} />
              <Row label="Departure" value={formatTime(bus.depTime)} />
              <Row label="Arrival" value={formatTime(bus.arrivalTime)} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Seats
            </Typography>
            {seats.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No seats selected yet.
              </Typography>
            ) : (
              <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {seats.map((s) => (
                  <Chip key={s} label={s} size="small" color="primary" />
                ))}
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            <Row label={`${formatINR(bus.price)} × ${seats.length}`} value={formatINR(total)} />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1.5 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary.main">
                {formatINR(total)}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}
