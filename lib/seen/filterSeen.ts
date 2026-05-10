import { createServerClient } from '@/lib/supabase/server';
import { ContentItem } from '@/types';

export async function filterSeen(
  userId: string,
  candidates: ContentItem[],
  limit: number
): Promise<ContentItem[]> {
  const supabase = createServerClient();
  const ids = candidates.map((c) => c.id);

  const { data: seen } = await supabase
    .from('seen')
    .select('content_id')
    .eq('user_id', userId)
    .in('content_id', ids);

  const seenIds = new Set((seen ?? []).map((s: { content_id: string }) => s.content_id));
  return candidates.filter((c) => !seenIds.has(c.id)).slice(0, limit);
}
