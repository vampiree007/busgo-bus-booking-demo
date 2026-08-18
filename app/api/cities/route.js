import { getCities } from '@/lib/db';

export async function GET() {
  return Response.json(getCities());
}
