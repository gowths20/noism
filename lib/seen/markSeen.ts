import { createServerClient } from '@/lib/supabase/server';

export async function markSeen(userId: string, contentId: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('seen').upsert({ user_id: userId, content_id: contentId });
}
