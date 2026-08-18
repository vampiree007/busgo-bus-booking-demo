// The "backend" data layer. Seed buses live in code; bookings + which seats are
// taken are saved to a JSON file so they survive page reloads and server restarts.
import fs from 'node:fs';
import path from 'node:path';
import { CITIES } from '@/lib/seed/cities';
import {
  BUS_TEMPLATES,
  buildBus,
  buildSeatLayout,
  encodeBusId,
  decodeBusId,
} from '@/lib/seed/buses';

const DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'bookings.json');

const freshDb = () => ({ bookings: [], bookedSeats: {} });

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return freshDb();
  }
}

function writeDb(db) {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

const seatKey = (busId, date) => `${busId}__${date}`;

// Seats taken = seeded-as-booked  +  seats from real bookings (this route + date).
function bookedSeatsFor(busId, date, seededBooked) {
  const db = readDb();
  return [...new Set([...(seededBooked || []), ...(db.bookedSeats[seatKey(busId, date)] || [])])];
}

function genId() {
  return 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function genPnr() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function getCities() {
  return CITIES;
}

// Return every bus for a route, with how many seats are still free.
export function searchBuses({ from, to, date }) {
  if (!from || !to) return [];
  return BUS_TEMPLATES.map((t) => {
    const id = encodeBusId(t.tid, from, to);
    const booked = bookedSeatsFor(id, date, t.seededBooked);
    return { ...buildBus(t, from, to), id, seatsAvailable: t.totalSeats - booked.length };
  }).sort((a, b) => a.depTime.localeCompare(b.depTime));
}

// Full detail for one bus, including the seat layout + which seats are taken.
export function getBus(busId, date) {
  const dec = decodeBusId(busId);
  if (!dec) return null;
  const t = BUS_TEMPLATES.find((x) => x.tid === dec.tid);
  if (!t) return null;
  const booked = bookedSeatsFor(busId, date, t.seededBooked);
  return {
    ...buildBus(t, dec.from, dec.to),
    id: busId,
    bookedSeats: booked,
    seatLayout: buildSeatLayout(t.type, t.totalSeats),
    seatsAvailable: t.totalSeats - booked.length,
  };
}

// Create a booking. Validates seats are still free, then saves it.
export function createBooking({ busId, date, seats, passengers, contact }) {
  if (!busId || !date) throw new Error('Missing busId or date');
  if (!Array.isArray(seats) || seats.length === 0) throw new Error('No seats selected');

  const dec = decodeBusId(busId);
  if (!dec) throw new Error('Invalid bus');
  const t = BUS_TEMPLATES.find((x) => x.tid === dec.tid);
  if (!t) throw new Error('Invalid bus');

  const db = readDb();
  const key = seatKey(busId, date);
  const already = new Set([...(t.seededBooked || []), ...(db.bookedSeats[key] || [])]);
  const clash = seats.filter((s) => already.has(s));
  if (clash.length) throw new Error(`Seats already booked: ${clash.join(', ')}`);

  const bus = buildBus(t, dec.from, dec.to);
  const pricePerSeat = t.basePrice;
  const booking = {
    id: genId(),
    pnr: genPnr(),
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    busId,
    date,
    from: dec.from,
    to: dec.to,
    operator: bus.operator,
    type: bus.type,
    depTime: bus.depTime,
    arrivalTime: bus.arrivalTime,
    arrivalDayOffset: bus.arrivalDayOffset,
    durationMin: bus.durationMin,
    seats,
    passengers: passengers || {},
    contact: contact || {},
    pricePerSeat,
    amount: pricePerSeat * seats.length,
  };

  db.bookings.push(booking);
  db.bookedSeats[key] = [...(db.bookedSeats[key] || []), ...seats];
  writeDb(db);
  return booking;
}

export function getBookings() {
  return readDb().bookings.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBooking(id) {
  return readDb().bookings.find((b) => b.id === id) || null;
}

// Demo helper: wipe everything back to the seed state.
export function reset() {
  writeDb(freshDb());
}
