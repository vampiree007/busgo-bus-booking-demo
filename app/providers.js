'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from '@/theme';
import { BookingProvider } from '@/context/BookingContext';

// Wraps the whole app in the providers our UI needs:
// - ThemeProvider/CssBaseline: MUI styling
// - LocalizationProvider: date picker support
// - BookingProvider: our one shared "booking in progress" state
export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BookingProvider>{children}</BookingProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
