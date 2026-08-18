import { getBus } from '@/lib/db';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function GET(request, ctx) {
  const { busId } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  await sleep(400);
  const bus = getBus(busId, date);
  if (!bus) return Response.json({ error: 'Bus not found' }, { status: 404 });
  return Response.json(bus);
}
