import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { contentId } = await req.json();
  await supabase.from('seen').upsert({ user_id: user.id, content_id: contentId });
  return NextResponse.json({ ok: true });
}
