import { getBooking } from '@/lib/db';

export async function GET(request, ctx) {
  const { id } = await ctx.params;
  const booking = getBooking(id);
  if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });
  return Response.json(booking);
}
