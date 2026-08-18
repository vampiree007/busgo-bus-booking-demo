import { searchBuses } from '@/lib/db';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  await sleep(450); // pretend it's a real network call, so we can show loading skeletons
  return Response.json(searchBuses({ from, to, date }));
}
