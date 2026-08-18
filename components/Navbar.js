'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await fetch('/api/reset', { method: 'POST' });
    setResetting(false);
    setToast(true);
    router.push('/');
    router.refresh();
  };

  const linkColor = (href) => (pathname === href ? 'primary.main' : 'text.secondary');

  // On phones these buttons collapse to just their icon (label hidden).
  const compactBtn = {
    fontWeight: 600,
    minWidth: { xs: 40, sm: 'auto' },
    px: { xs: 1, sm: 2 },
    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
  };

  return (
    <AppBar position="sticky" elevation={0} className="no-print">
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', gap: { xs: 0.5, sm: 1 } }}>
        <Box
          component={Link}
          href="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto', color: 'text.primary' }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #5B3DF5, #7C66FF)',
              color: '#fff',
            }}
          >
            <DirectionsBusRoundedIcon fontSize="small" />
          </Box>
          <Box sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>BusGo</Box>
        </Box>

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ alignItems: 'center' }}>
          <Button
            component={Link}
            href="/"
            sx={{ fontWeight: 600, color: linkColor('/'), display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Search
          </Button>
          <Button
            component={Link}
            href="/bookings"
            startIcon={<ConfirmationNumberRoundedIcon />}
            sx={{ ...compactBtn, color: linkColor('/bookings') }}
            aria-label="My Bookings"
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              My Bookings
            </Box>
          </Button>
          <Button
            onClick={handleReset}
            disabled={resetting}
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltRoundedIcon />}
            sx={{ ...compactBtn, borderColor: 'divider', color: 'text.secondary' }}
            aria-label="Reset demo"
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Reset demo
            </Box>
          </Button>
        </Stack>
      </Toolbar>

      <Snackbar
        open={toast}
        autoHideDuration={2500}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast(false)}>
          Demo reset — all bookings cleared.
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
