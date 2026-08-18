'use client';
import { createContext, useContext, useMemo, useState } from 'react';

// ONE shared place for the "booking in progress".
// Any page can read/update it via the useBooking() hook below.
// (This replaces something heavier like Redux — it's just React's built-in Context.)
const BookingContext = createContext(null);

const emptyContact = { phone: '', email: '', boarding: '', dropping: '' };

export function BookingProvider({ children }) {
  const [search, setSearchState] = useState({ from: '', to: '', date: '' });
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]); // array of seat ids, e.g. ['L1','L2']
  const [passengers, setPassengers] = useState({}); // { seatId: { name, age, gender } }
  const [contact, setContactState] = useState(emptyContact);

  const setSearch = (next) => setSearchState((prev) => ({ ...prev, ...next }));

  // Called when the user opens a bus to book — start a clean booking for it.
  const startBooking = (nextBus) => {
    setBus(nextBus);
    setSeats([]);
    setPassengers({});
    setContactState(emptyContact);
  };

  // Add/remove a seat (respecting an optional max). Keeps passenger map in sync.
  const toggleSeat = (seatId, max = 6) => {
    setSeats((prev) => {
      if (prev.includes(seatId)) {
        setPassengers((p) => {
          const next = { ...p };
          delete next[seatId];
          return next;
        });
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= max) return prev; // ignore extra picks past the limit
      setPassengers((p) => ({ ...p, [seatId]: { name: '', age: '', gender: 'male' } }));
      return [...prev, seatId];
    });
  };

  const setPassenger = (seatId, field, value) =>
    setPassengers((p) => ({ ...p, [seatId]: { ...p[seatId], [field]: value } }));

  const setContact = (next) => setContactState((prev) => ({ ...prev, ...next }));

  const clearBooking = () => {
    setBus(null);
    setSeats([]);
    setPassengers({});
    setContactState(emptyContact);
  };

  const value = useMemo(
    () => ({
      search,
      setSearch,
      bus,
      startBooking,
      seats,
      toggleSeat,
      passengers,
      setPassenger,
      contact,
      setContact,
      clearBooking,
    }),
    [search, bus, seats, passengers, contact],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

// Small helper so pages just call: const { seats, toggleSeat } = useBooking();
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
