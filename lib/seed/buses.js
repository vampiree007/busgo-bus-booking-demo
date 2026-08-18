import { CITIES } from '@/lib/seed/cities';
import { addMinutes } from '@/utils/format';

// A handful of bus "templates". We reuse them for ANY route the user searches,
// so every from/to pair returns results (perfect for a demo).
export const BUS_TEMPLATES = [
  {
    tid: 'greenline-ac-sleeper',
    operator: 'GreenLine Travels',
    type: 'AC Sleeper (2+1)',
    depTime: '21:30',
    durationMin: 480,
    basePrice: 1299,
    totalSeats: 30,
    amenities: ['AC', 'Charging', 'Blanket', 'Water'],
    rating: 4.6,
    seededBooked: ['L1', 'L2', 'U5', 'U6', 'L11'],
  },
  {
    tid: 'redexpress-ac-seater',
    operator: 'RedExpress',
    type: 'AC Seater (2+2)',
    depTime: '23:00',
    durationMin: 420,
    basePrice: 899,
    totalSeats: 40,
    amenities: ['AC', 'Charging', 'Reading Light'],
    rating: 4.3,
    seededBooked: ['1', '2', '15', '16', '27'],
  },
  {
    tid: 'nightrider-nonac-sleeper',
    operator: 'NightRider',
    type: 'Non-AC Sleeper (2+1)',
    depTime: '22:15',
    durationMin: 510,
    basePrice: 749,
    totalSeats: 30,
    amenities: ['Charging', 'Blanket'],
    rating: 4.0,
    seededBooked: ['L7', 'U7', 'U8'],
  },
  {
    tid: 'orange-volvo',
    operator: 'Orange Tours',
    type: 'Volvo Multi-Axle (2+2)',
    depTime: '20:00',
    durationMin: 450,
    basePrice: 1099,
    totalSeats: 40,
    amenities: ['AC', 'Charging', 'Water', 'Movie'],
    rating: 4.5,
    seededBooked: ['9', '10', '11', '25', '26'],
  },
  {
    tid: 'citylink-ac-sleeper',
    operator: 'CityLink',
    type: 'AC Sleeper (2+1)',
    depTime: '18:45',
    durationMin: 540,
    basePrice: 1199,
    totalSeats: 36,
    amenities: ['AC', 'Charging', 'Blanket', 'Snacks'],
    rating: 4.2,
    seededBooked: ['L4', 'L5', 'U10', 'U11', 'U12', 'L15'],
  },
  {
    tid: 'sh-ac-seater',
    operator: 'SH Travels',
    type: 'AC Seater (2+2)',
    depTime: '06:30',
    durationMin: 390,
    basePrice: 649,
    totalSeats: 40,
    amenities: ['AC', 'Charging'],
    rating: 3.9,
    seededBooked: ['3', '4', '5'],
  },
  {
    tid: 'royal-ac-sleeper',
    operator: 'Royal Cruiser',
    type: 'AC Sleeper (2+1)',
    depTime: '23:45',
    durationMin: 600,
    basePrice: 1499,
    totalSeats: 30,
    amenities: ['AC', 'Charging', 'Blanket', 'Water', 'Snacks'],
    rating: 4.7,
    seededBooked: ['L9', 'U1'],
  },
];

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// A bus id encodes both the template AND the route, e.g. "orange-volvo__pune__goa".
// That way seat bookings are tracked per route+date, and any city pair works.
export function encodeBusId(tid, from, to) {
  return `${tid}__${slug(from)}__${slug(to)}`;
}

export function decodeBusId(id) {
  const parts = String(id).split('__');
  if (parts.length < 3) return null;
  const [tid, fromSlug, toSlug] = parts;
  const from = CITIES.find((c) => slug(c) === fromSlug);
  const to = CITIES.find((c) => slug(c) === toSlug);
  if (!from || !to) return null;
  return { tid, from, to };
}

// Turn a template + route into a full bus object (computes arrival time).
export function buildBus(t, from, to) {
  const arr = addMinutes(t.depTime, t.durationMin);
  return {
    tid: t.tid,
    operator: t.operator,
    type: t.type,
    from,
    to,
    depTime: t.depTime,
    arrivalTime: arr.time,
    arrivalDayOffset: arr.dayOffset,
    durationMin: t.durationMin,
    price: t.basePrice,
    totalSeats: t.totalSeats,
    amenities: t.amenities,
    rating: t.rating,
  };
}

// Build the seat grid the SeatMap renders. Sleepers get two decks (lower/upper),
// seaters get one. `null` cells are the aisle/spacers.
export function buildSeatLayout(type, totalSeats) {
  const isSleeper = /sleeper/i.test(type);

  if (isSleeper) {
    const perDeck = Math.ceil(totalSeats / 2);
    const makeRows = (prefix, count) => {
      const ids = Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
      const rows = [];
      for (let i = 0; i < ids.length; i += 3) {
        // 2 berths + aisle + 1 berth
        rows.push([ids[i] || null, ids[i + 1] || null, null, ids[i + 2] || null]);
      }
      return rows;
    };
    return {
      kind: 'sleeper',
      decks: [
        { name: 'Lower', rows: makeRows('L', perDeck) },
        { name: 'Upper', rows: makeRows('U', totalSeats - perDeck) },
      ],
    };
  }

  const ids = Array.from({ length: totalSeats }, (_, i) => String(i + 1));
  const rows = [];
  for (let i = 0; i < ids.length; i += 4) {
    // 2 seats + aisle + 2 seats
    rows.push([ids[i] || null, ids[i + 1] || null, null, ids[i + 2] || null, ids[i + 3] || null]);
  }
  return { kind: 'seater', decks: [{ name: 'Seater', rows }] };
}
