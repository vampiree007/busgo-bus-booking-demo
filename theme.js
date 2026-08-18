'use client';
import { createTheme } from '@mui/material/styles';

// One central place for the app's look & feel (colors, fonts, rounded corners).
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5B3DF5', light: '#7C66FF', dark: '#4429D6' }, // vivid violet
    secondary: { main: '#FF6B5C' }, // warm coral for accents/CTAs
    success: { main: '#10B981' },
    background: { default: '#EAEBF5', paper: '#FFFFFF' },
    text: { primary: '#15151E', secondary: '#6B7280' },
    divider: '#ECECF3',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, paddingInline: 18 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E6E6F0',
          borderRadius: 8,
          boxShadow: '0 4px 18px rgba(21,21,55,0.06)',
        },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 8 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'saturate(180%) blur(8px)',
          color: '#15151E',
          borderBottom: '1px solid #ECECF3',
        },
      },
    },
  },
});

export default theme;
