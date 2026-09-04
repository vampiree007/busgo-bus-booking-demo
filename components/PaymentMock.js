'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { formatINR } from '@/utils/format';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const onlyDigits = (s, max) => s.replace(/\D/g, '').slice(0, max);
const groupCard = (d) => d.replace(/(.{4})/g, '$1 ').trim();

const METHODS = [
  { key: 'upi', label: 'UPI', desc: 'PhonePe, Google Pay, Paytm & more', icon: <SmartphoneRoundedIcon /> },
  { key: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: <CreditCardRoundedIcon /> },
  { key: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks', icon: <AccountBalanceRoundedIcon /> },
  { key: 'wallet', label: 'Wallets', desc: 'Paytm, Amazon Pay, Mobikwik', icon: <AccountBalanceWalletRoundedIcon /> },
];

const UPI_APPS = [
  { key: 'phonepe', name: 'PhonePe', color: '#5F259F', badge: 'Pe' },
  { key: 'gpay', name: 'Google Pay', color: '#4285F4', badge: 'G' },
  { key: 'paytm', name: 'Paytm', color: '#00BAF2', badge: 'P' },
  { key: 'bhim', name: 'BHIM', color: '#00847D', badge: 'B' },
];

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'];
const WALLETS = [
  { name: 'Paytm', color: '#00BAF2' },
  { name: 'Amazon Pay', color: '#FF9900' },
  { name: 'Mobikwik', color: '#E42529' },
];

function AppBadge({ color, label }) {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        bgcolor: color,
        color: '#fff',
        fontWeight: 800,
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      {label}
    </Box>
  );
}

// A small selectable brand pill used for UPI apps and wallets.
function BrandPill({ selected, color, badge, name, onClick }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'rgba(91,61,245,0.06)' : 'transparent',
      }}
    >
      <AppBadge color={color} label={badge} />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {name}
      </Typography>
    </Box>
  );
}

export default function PaymentMock({ amount, onPay }) {
  const [stage, setStage] = useState('method'); // method | otp | processing | done
  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('phonepe');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [wallet, setWallet] = useState('');
  const [otp, setOtp] = useState('');
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const upiValid = Boolean(upiApp) || /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim());
  const cardValid =
    card.number.length === 16 && card.name.trim() && card.expiry.length === 4 && card.cvv.length === 3;
  const canPay =
    method === 'upi'
      ? upiValid
      : method === 'card'
        ? cardValid
        : method === 'netbanking'
          ? Boolean(bank)
          : Boolean(wallet);

  const methodLabel =
    method === 'upi'
      ? upiApp
        ? UPI_APPS.find((a) => a.key === upiApp)?.name
        : upiId || 'UPI'
      : method === 'card'
        ? 'your card'
        : method === 'netbanking'
          ? bank || 'net banking'
          : wallet || 'your wallet';

  const startPay = () => {
    if (!canPay) return;
    setError('');
    setOtp('');
    setResent(false);
    setStage('otp');
  };

  const verify = async () => {
    if (otp.length < 4) return; // any digits are accepted — this is a demo
    setError('');
    setStage('processing');
    await sleep(1100);
    setStage('done');
    await sleep(1300);
    try {
      await onPay(); // creates the booking and navigates to the ticket
    } catch (e) {
      setError(e.message || 'Payment failed. Please try again.');
      setStage('method');
    }
  };

  // ── Processing / success screen ─────────────────────────────
  if (stage === 'processing' || stage === 'done') {
    const done = stage === 'done';
    return (
      <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center', py: 5 }}>
        {done ? (
          <CheckCircleRoundedIcon sx={{ fontSize: 76, color: 'success.main' }} />
        ) : (
          <CircularProgress size={64} thickness={4} />
        )}
        <Box>
          <Typography variant="h5">{done ? 'Payment completed' : 'Processing payment…'}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {done ? `${formatINR(amount)} paid successfully` : 'Please don’t close this window.'}
          </Typography>
        </Box>
        {done && (
          <Typography variant="caption" color="text.secondary">
            Generating your ticket…
          </Typography>
        )}
      </Stack>
    );
  }

  // ── OTP verification screen ─────────────────────────────────
  if (stage === 'otp') {
    return (
      <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center', py: 1 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(91,61,245,0.1)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SmartphoneRoundedIcon color="primary" />
        </Box>
        <Box>
          <Typography variant="h6">Verify your payment</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter the OTP sent to <b>+91 ••••• ••210</b> to approve {formatINR(amount)} via {methodLabel}.
          </Typography>
        </Box>

        <TextField
          value={otp}
          onChange={(e) => setOtp(onlyDigits(e.target.value, 6))}
          placeholder="——————"
          autoFocus
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              'aria-label': 'One-time password',
              style: { textAlign: 'center', letterSpacing: '0.45em', fontSize: 22, fontWeight: 700 },
            },
          }}
          sx={{ width: 210 }}
        />
        <Typography variant="caption" color="text.secondary">
          {resent ? 'A new OTP has been sent (demo).' : 'Demo mode — any 6-digit OTP works.'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={otp.length < 4}
          onClick={verify}
          startIcon={<LockRoundedIcon />}
        >
          Verify & Pay {formatINR(amount)}
        </Button>
        <Stack direction="row" spacing={2.5}>
          <Link component="button" type="button" onClick={() => setStage('method')} underline="hover">
            Change method
          </Link>
          <Link
            component="button"
            type="button"
            onClick={() => {
              setResent(true);
              setOtp('');
            }}
            underline="hover"
          >
            Resend OTP
          </Link>
        </Stack>
      </Stack>
    );
  }

  // ── Method selection screen ─────────────────────────────────
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Payment</Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
          <LockRoundedIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">100% secure</Typography>
        </Stack>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#F5F4FF',
          borderColor: '#E2DEFB',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Amount payable
        </Typography>
        <Typography variant="h6" color="primary.main">
          {formatINR(amount)}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle2">Choose a payment method</Typography>

      <Stack spacing={1.25}>
        {METHODS.map((m) => {
          const active = method === m.key;
          return (
            <Paper
              key={m.key}
              variant="outlined"
              onClick={() => setMethod(m.key)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                borderColor: active ? 'primary.main' : 'divider',
                boxShadow: active ? '0 0 0 1px #5B3DF5' : 'none',
                transition: 'border-color .15s ease',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{ color: active ? 'primary.main' : 'text.secondary', display: 'grid', placeItems: 'center' }}
                >
                  {m.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2">{m.label}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {m.desc}
                  </Typography>
                </Box>
                <Radio checked={active} size="small" sx={{ p: 0.5 }} />
              </Stack>

              <Collapse in={active} unmountOnExit>
                <Box sx={{ pt: 1.75 }} onClick={(e) => e.stopPropagation()}>
                  {m.key === 'upi' && (
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {UPI_APPS.map((a) => (
                          <BrandPill
                            key={a.key}
                            selected={upiApp === a.key}
                            color={a.color}
                            badge={a.badge}
                            name={a.name}
                            onClick={() => {
                              setUpiApp(a.key);
                              setUpiId('');
                            }}
                          />
                        ))}
                      </Stack>
                      <Divider>
                        <Typography variant="caption" color="text.secondary">
                          or
                        </Typography>
                      </Divider>
                      <TextField
                        size="small"
                        label="Enter UPI ID"
                        placeholder="name@bank"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setUpiApp('');
                        }}
                      />
                    </Stack>
                  )}

                  {m.key === 'card' && (
                    <Stack spacing={1.5}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Card number"
                        placeholder="4242 4242 4242 4242"
                        value={groupCard(card.number)}
                        onChange={(e) => setCard((c) => ({ ...c, number: onlyDigits(e.target.value, 16) }))}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Name on card"
                        value={card.name}
                        onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                      />
                      <Stack direction="row" spacing={1.5}>
                        <TextField
                          size="small"
                          label="Expiry (MM/YY)"
                          placeholder="MM/YY"
                          value={
                            card.expiry
                              ? `${card.expiry.slice(0, 2)}${card.expiry.length > 2 ? '/' : ''}${card.expiry.slice(2)}`
                              : ''
                          }
                          onChange={(e) => setCard((c) => ({ ...c, expiry: onlyDigits(e.target.value, 4) }))}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          size="small"
                          label="CVV"
                          type="password"
                          value={card.cvv}
                          onChange={(e) => setCard((c) => ({ ...c, cvv: onlyDigits(e.target.value, 3) }))}
                          sx={{ flex: 1 }}
                        />
                      </Stack>
                      <Link
                        component="button"
                        type="button"
                        underline="hover"
                        sx={{ alignSelf: 'flex-start' }}
                        onClick={() =>
                          setCard({ number: '4242424242424242', name: 'DEMO USER', expiry: '1228', cvv: '123' })
                        }
                      >
                        Fill test card
                      </Link>
                    </Stack>
                  )}

                  {m.key === 'netbanking' && (
                    <FormControl size="small" fullWidth>
                      <InputLabel id="bank-label">Select bank</InputLabel>
                      <Select
                        labelId="bank-label"
                        label="Select bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                      >
                        {BANKS.map((b) => (
                          <MenuItem key={b} value={b}>
                            {b}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {m.key === 'wallet' && (
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      {WALLETS.map((w) => (
                        <BrandPill
                          key={w.name}
                          selected={wallet === w.name}
                          color={w.color}
                          badge={w.name[0]}
                          name={w.name}
                          onClick={() => setWallet(w.name)}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={!canPay}
        onClick={startPay}
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
