import { ContentItem } from '@/types';
import { hashContent } from '@/lib/utils/hashContent';

export const SUBREDDITS = [
  { name: 'worldnews', country: null, topic: 'news' },
  { name: 'science', country: null, topic: 'science' },
  { name: 'Documentaries', country: null, topic: 'documentary' },
  { name: 'india', country: 'IN', topic: 'india' },
  { name: 'todayilearned', country: null, topic: 'trivia' },
  { name: 'explainlikeimfive', country: null, topic: 'education' },
];

export async function fetchSubreddit(
  sub: (typeof SUBREDDITS)[0]
): Promise<ContentItem[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${sub.name}/new.json?limit=10`,
    { headers: { 'User-Agent': process.env.REDDIT_USER_AGENT ?? 'Noism/1.0' }, next: { revalidate: 1800 } }
  );
  const json = await res.json();
  const posts: unknown[] = json?.data?.children ?? [];

  return posts
    .filter((p: unknown) => !(p as Record<string, Record<string, unknown>>).data.over_18 && !(p as Record<string, Record<string, unknown>>).data.is_self)
    .map((p: unknown) => {
      const d = (p as Record<string, Record<string, unknown>>).data;
      return {
        id: hashContent('reddit_' + (d.id as string)),
        source: 'reddit' as const,
        sourceName: `r/${sub.name}`,
        title: d.title as string,
        summary: typeof d.selftext === 'string' ? d.selftext.slice(0, 200) : undefined,
        url: `https://reddit.com${d.permalink as string}`,
        imageUrl: typeof d.thumbnail === 'string' && d.thumbnail.startsWith('http') ? d.thumbnail : undefined,
        country: sub.country ?? undefined,
        topic: sub.topic,
        publishedAt: new Date((d.created_utc as number) * 1000).toISOString(),
      };
    });
}
