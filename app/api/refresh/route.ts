import { createServerClient } from '@/lib/supabase/server';
import { fetchRSSFeed, RSS_FEEDS } from '@/lib/sources/rss';
import { fetchSubreddit, SUBREDDITS } from '@/lib/sources/reddit';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerClient();
  const allContent = [];

  for (const feed of RSS_FEEDS) {
    try { allContent.push(...await fetchRSSFeed(feed)); }
    catch (e) { console.error(`RSS failed: ${feed.name}`, e); }
  }

  for (const sub of SUBREDDITS) {
    try { allContent.push(...await fetchSubreddit(sub)); }
    catch (e) { console.error(`Reddit failed: r/${sub.name}`, e); }
  }

  if (allContent.length > 0) {
    const { error } = await supabase.from('content').upsert(allContent, { onConflict: 'id', ignoreDuplicates: true });
    if (error) console.error('Upsert error:', error);
  }

  await supabase
    .from('seen')
    .delete()
    .lt('seen_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

  return NextResponse.json({ refreshed: allContent.length });
}
