# 🚌 BusGo — Bus Booking Demo

A small but polished **bus-ticket booking** web app. Built as a learning/demo project, so the
code is meant to be easy to read and explain — no heavy state libraries, no real database.

**Full-stack in one Next.js app, plain JavaScript (no TypeScript).**

## The whole idea in one breath

> **API routes** = the backend. **`fetch`** = talk to the backend. **`useState`** = remember
> things on a page. One **`BookingContext`** = the shared "booking in progress". **MUI** = the
> pretty components.

That's the entire mental model. If you understand those five things, you understand this app.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Tip: there's a **"Reset demo"** button in the top bar that wipes all bookings back to the
> starting state — handy when showing the app to someone.

## The user flow (5 screens)

1. **Search** (`/`) — pick from / to / date
2. **Results** (`/results`) — list of buses with filters + sorting
3. **Booking** (`/book/[busId]`) — a 3-step wizard: pick seats → passenger details → payment
4. **Confirmation** (`/confirmation/[bookingId]`) — your ticket, with confetti 🎉 + print
5. **My Bookings** (`/bookings`) — every ticket you've booked

## How it's organized

```
app/
  page.js                       Search (home)
  results/page.js               Search results
  book/[busId]/page.js          Seat → passenger → payment wizard
  confirmation/[bookingId]/...  Ticket + confetti
  bookings/page.js              All bookings
  api/                          ← THE BACKEND (plain Node functions)
    cities/  buses/  bookings/  reset/
  layout.js  providers.js  globals.css

lib/                            "Server" data layer
  seed/cities.js  seed/buses.js   demo data (buses, cities)
  db.js                           reads/writes bookings to a JSON file

context/BookingContext.js       the one shared state (the booking in progress)
components/                     Navbar, SearchForm, BusCard, Filters, SeatMap,
                                PassengerForm, PaymentMock, TicketCard
theme.js                        colors, fonts, rounded corners (Material UI theme)
utils/format.js                 money / time / date helpers
```

## How the "backend" works (no real database)

- Buses and cities are just **seed data in `lib/seed/`**. The same handful of buses is reused for
  any route you search, so every search returns results.
- When you book, the booking is **saved to a JSON file** (`.data/bookings.json`, created
  automatically and git-ignored). That's why your bookings and "taken" seats **survive a page
  reload or even a server restart** — try it!
- It's intentionally not production-grade: no login, no real payment, no real database.

## Cool bits to point out in a demo

- **Live seat map** with animated selection, greyed-out booked seats, and a lower/upper deck
  toggle for sleeper buses.
- **Card-flip payment** (use the *"Fill test card"* link) — purely a CSS 3D flip, no real charge.
- **Confetti** on a successful booking.
- **Printable ticket** (the Print button uses the browser's print dialog).

## Tech

Next.js (App Router) · React · Material UI · `canvas-confetti` · plain `fetch` + React Context.
