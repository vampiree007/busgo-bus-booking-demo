'use client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const POINTS = ['Central Bus Stand', 'Railway Station', 'Airport Road', 'City Center', 'Highway Toll'];

export default function PassengerForm({ seats, passengers, setPassenger, contact, setContact, from, to }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Passenger details</Typography>

      {seats.map((seat) => {
        const p = passengers[seat] || {};
        return (
          <Paper key={seat} variant="outlined" sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                alignItems: 'center',
                gridTemplateColumns: { xs: '1fr', sm: '64px 1fr 90px 130px' },
              }}
            >
              <Chip label={`Seat ${seat}`} color="primary" variant="outlined" />
              <TextField
                label="Full name"
                value={p.name || ''}
                onChange={(e) => setPassenger(seat, 'name', e.target.value)}
                size="small"
              />
              <TextField
                label="Age"
                type="number"
                value={p.age || ''}
                onChange={(e) => setPassenger(seat, 'age', e.target.value)}
                size="small"
                slotProps={{ htmlInput: { min: 1, max: 120 } }}
              />
              <FormControl size="small">
                <InputLabel id={`g-${seat}`}>Gender</InputLabel>
                <Select
                  labelId={`g-${seat}`}
                  label="Gender"
                  value={p.gender || 'male'}
                  onChange={(e) => setPassenger(seat, 'gender', e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        );
      })}

      <Typography variant="h6" sx={{ pt: 1 }}>
        Contact & stops
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <TextField
            label="Phone number"
            value={contact.phone || ''}
            onChange={(e) => setContact({ phone: e.target.value })}
            size="small"
          />
          <TextField
            label="Email"
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact({ email: e.target.value })}
            size="small"
          />
          <FormControl size="small">
            <InputLabel id="boarding">Boarding point ({from})</InputLabel>
            <Select
              labelId="boarding"
              label={`Boarding point (${from})`}
              value={contact.boarding || ''}
              onChange={(e) => setContact({ boarding: e.target.value })}
            >
              {POINTS.map((pt) => (
                <MenuItem key={pt} value={pt}>
                  {pt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="dropping">Dropping point ({to})</InputLabel>
            <Select
              labelId="dropping"
              label={`Dropping point (${to})`}
              value={contact.dropping || ''}
              onChange={(e) => setContact({ dropping: e.target.value })}
            >
              {POINTS.map((pt) => (
                <MenuItem key={pt} value={pt}>
                  {pt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Stack>
  );
}
