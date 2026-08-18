import { getBookings, createBooking } from '@/lib/db';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function GET() {
  await sleep(350);
  return Response.json(getBookings());
}

export async function POST(request) {
  try {
    const body = await request.json();
    await sleep(600); // pretend we're talking to a payment gateway
    const booking = createBooking(body);
    return Response.json(booking, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message || 'Booking failed' }, { status: 400 });
  }
}
