'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { formatINR } from '@/utils/format';

const onlyDigits = (s, max) => s.replace(/\D/g, '').slice(0, max);
const groupCard = (d) => d.replace(/(.{4})/g, '$1 ').trim();

export default function PaymentMock({ amount, onPay }) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(''); // MMYY
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const valid = number.length === 16 && name.trim() && expiry.length === 4 && cvv.length === 3;

  const fillTestCard = () => {
    setNumber('4242424242424242');
    setName('DEMO USER');
    setExpiry('1228');
    setCvv('123');
  };

  const pay = async () => {
    if (!valid || busy) return;
    setError('');
    setBusy(true);
    setFlipped(true);
    try {
      await onPay(); // parent creates the booking and navigates to the ticket
    } catch (e) {
      setError(e.message || 'Payment failed');
      setBusy(false);
      setFlipped(false);
    }
  };

  const faceBase = {
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    p: 3,
    color: '#fff',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Payment</Typography>

      {/* The animated 3D card */}
      <Box sx={{ perspective: '1200px', alignSelf: 'center', width: '100%', maxWidth: 380 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 216,
            transition: 'transform .6s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'none',
          }}
        >
          {/* Front */}
          <Box sx={{ ...faceBase, background: 'linear-gradient(135deg,#4429D6,#7C66FF)' }}>
            <Box sx={{ width: 44, height: 32, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.35)' }} />
            <Typography
              sx={{ mt: 'auto', fontSize: { xs: 18, sm: 22 }, letterSpacing: { xs: 1.5, sm: 3 }, fontWeight: 700 }}
            >
              {groupCard(number) || '•••• •••• •••• ••••'}
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  CARD HOLDER
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{name || 'YOUR NAME'}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  EXPIRES
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {expiry ? `${expiry.slice(0, 2)}/${expiry.slice(2)}` : 'MM/YY'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Back */}
          <Box
            sx={{
              ...faceBase,
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg,#15151E,#3a3a52)',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {busy ? (
              <>
                <CircularProgress sx={{ color: '#fff' }} />
                <Typography sx={{ mt: 2 }}>Processing payment…</Typography>
              </>
            ) : (
              <>
                <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main' }} />
                <Typography sx={{ mt: 1 }}>Payment successful</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Card fields */}
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">Card details</Typography>
          <Link component="button" type="button" onClick={fillTestCard} underline="hover">
            Fill test card
          </Link>
        </Stack>
        <TextField
          label="Card number"
          value={groupCard(number)}
          onChange={(e) => setNumber(onlyDigits(e.target.value, 16))}
          placeholder="4242 4242 4242 4242"
          fullWidth
          disabled={busy}
        />
        <TextField
          label="Name on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={busy}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Expiry (MM/YY)"
            value={expiry ? `${expiry.slice(0, 2)}${expiry.length > 2 ? '/' : ''}${expiry.slice(2)}` : ''}
            onChange={(e) => setExpiry(onlyDigits(e.target.value, 4))}
            placeholder="MM/YY"
            disabled={busy}
            sx={{ flex: 1 }}
          />
          <TextField
            label="CVV"
            value={cvv}
            onChange={(e) => setCvv(onlyDigits(e.target.value, 3))}
            type="password"
            disabled={busy}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Stack>

      <Button
        variant="contained"
        size="large"
        onClick={pay}
        disabled={!valid || busy}
        startIcon={<LockRoundedIcon />}
      >
        Pay {formatINR(amount)}
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: -1 }}>
        This is a demo — no real payment is processed.
      </Typography>
    </Stack>
  );
}
