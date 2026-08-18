import { reset } from '@/lib/db';

// Demo convenience: clears all bookings + freed seats back to the seed state.
export async function POST() {
  reset();
  return Response.json({ ok: true });
}
