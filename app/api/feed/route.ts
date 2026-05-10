import { createServerClient } from '@/lib/supabase/server';
import { filterSeen } from '@/lib/seen/filterSeen';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country') ?? undefined;
  const topic = searchParams.get('topic') ?? undefined;
  const limit = parseInt(searchParams.get('limit') ?? '10');

  let query = supabase
    .from('content')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit * 5);

  if (country) query = query.eq('country', country);
  if (topic) query = query.eq('topic', topic);

  const { data: candidates } = await query;
  if (!candidates) return NextResponse.json({ items: [], hasMore: false });

  const fresh = await filterSeen(user.id, candidates, limit);
  return NextResponse.json({ items: fresh, hasMore: fresh.length === limit });
}
